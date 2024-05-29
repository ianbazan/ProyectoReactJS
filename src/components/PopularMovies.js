// src/components/PopularMovies.js
import React from 'react';

const PopularMovies = ({ movies, selectMovie, URL_IMAGE }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Películas Populares</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="relative cursor-pointer"
            onClick={() => selectMovie(movie)}
          >
            <img
              src={`${URL_IMAGE}${movie.poster_path}`}
              alt={movie.title}
              className="rounded shadow-md"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-center text-sm rounded-b">
              {movie.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularMovies;
