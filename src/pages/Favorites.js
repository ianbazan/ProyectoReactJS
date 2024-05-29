import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import MovieCard from '../components/MovieCard';

const Favorites = ({ selectMovie }) => {
  const { user, favorites, removeFavorite } = useContext(UserContext);

  return (
    <div className='p-5'>
      <h1 className='text-4xl text-center text-white mb-10'>Mis Favoritos</h1>
      <div className='container mx-auto mt-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              selectMovie={selectMovie}
              URL_IMAGE='https://image.tmdb.org/t/p/original/'
              showRemoveButton={true}
              onRemoveFavorite={() => removeFavorite(movie.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
