import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import s from './Searchbar.module.css';

export default function Searchbar({ onSubmit }) {
  const [imageName, setImageName] = useState('');

  const handleNameChange = event => {
    setImageName(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (imageName.trim() === '') {
      toast.error('Please enter name image.');
      return;
    }

    onSubmit(imageName);
    setImageName('');
  };

  return (
    <>
      <header>
        <form className={s.searchForm} onSubmit={handleSubmit}>
          <button className={s.button} type="submit">
            <span>Search</span>
          </button>

          <input
            className={s.input}
            type="text"
            value={imageName}
            onChange={handleNameChange}
            placeholder="Search images and photos"
          />
        </form>
      </header>
      <ToastContainer autoClose={3000} position="top-center" />
    </>
  );
}
