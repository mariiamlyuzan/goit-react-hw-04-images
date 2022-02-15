import { useState, useEffect } from 'react';
import './App.css';
import Searchbar from './components/Searchbar';
import fetchImages from './services/images-api';
import ImageGallery from './components/ImageGallery';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MutatingDots } from 'react-loader-spinner';
import Button from './components/Button';
import Modal from './components/Modal';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};
export default function App() {
  const [imageName, setImageName] = useState('');
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(Status.IDLE);
  const [page, setPage] = useState(1);
  const [loadEnd, setLoadEnd] = useState(false);
  const [message, setMessage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (!imageName || !page) {
      return;
    }

    setStatus(Status.PENDING);

    fetchImages(imageName, page)
      .then(images => {
        setImages(state => [...state, ...images.hits]);
        setStatus(Status.RESOLVED);

        setLoadEnd(true);

        const endPage = images.totalHits / images.hits.length;
        if (images.hits.length === 0) {
          setLoadEnd(false);
          toast.error(
            'Sorry, there are no images matching your search query. Please try again.',
          );
        }

        if (page === endPage) {
          setLoadEnd(false);
          toast.error(
            `We're sorry, but you've reached the end of search results.`,
          );
        }
      })
      .catch(error => {
        setMessage('Enter correct name.');
      });
  }, [imageName, page]);

  const loadMoreBtn = () => {
    setPage(state => state + 1);
  };
  const handleFormSubmit = imageName => {
    setImageName(imageName);
    setImages([]);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleClick = (url, tags) => {
    setUrl(url);
    setTags(tags);
    toggleModal();
  };

  return (
    <>
      <Searchbar onSubmit={handleFormSubmit} />
      {status === 'idle' && <p>Enter name.</p>}
      {status === 'pending' && (
        <MutatingDots
          color="#00BFFF"
          height={80}
          width={80}
          ariaLabel="loading"
        />
      )}
      {status === 'rejected' && <div>{message}</div>}
      {status === 'resolved' && page > 1 && (
        <ImageGallery images={images} tags={tags} onClick={handleClick} />
      )}
      {loadEnd && (
        <>
          <ImageGallery images={images} tags={tags} onClick={handleClick} />
          {status === 'pending' && (
            <MutatingDots
              color="#00BFFF"
              height={80}
              width={80}
              ariaLabel="loading"
            />
          )}
          <Button handleIncrement={loadMoreBtn} />
        </>
      )}

      {showModal && (
        <Modal onClose={toggleModal}>
          <img className="imageLarge" alt={tags} src={url} />
        </Modal>
      )}
    </>
  );
}
