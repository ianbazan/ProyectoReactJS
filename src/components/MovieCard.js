import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const MovieCard = ({ movie, selectMovie, URL_IMAGE, showRemoveButton, onRemoveFavorite }) => {
  const { favorites, addFavorite, removeFavorite } = useContext(UserContext);

  const isFavorite = favorites.some(favMovie => favMovie.id === movie.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <div className='cursor-pointer transform transition-transform hover:scale-105' onClick={() => selectMovie(movie)}>
      <img
        src={`${URL_IMAGE}${movie.poster_path}`}
        alt={movie.title}
        className='w-full h-96 object-cover rounded-lg shadow-lg'
      />
      <div className='flex flex-col items-center mt-4'>
        <h4 className='text-xl flex items-center'>
          {movie.title}
          <FontAwesomeIcon
            icon={isFavorite ? solidHeart : regularHeart}
            className={`ml-2 cursor-pointer ${isFavorite ? 'text-red-500' : 'text-gray-400'} transition-colors duration-300 ease-in-out hover:text-red-500`}
            onClick={handleFavoriteClick}
          />
        </h4>
      </div>
      <p className='text-center text-gray-400'>Calificación: {movie.vote_average}</p>
      {showRemoveButton && (
        <div className='text-center mt-4'>
          <button
            className='ml-2 px-4 py-2 rounded bg-red-500 text-white'
            onClick={(e) => { 
              e.stopPropagation();
              onRemoveFavorite(); 
            }}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
