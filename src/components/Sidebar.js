// src/components/Sidebar.js
import React from 'react';

const Sidebar = ({ selectCategory, fetchPopularMovies, fetchTopRatedMovies, genres }) => {
  return (
    <aside className="w-64 h-3/4 bg-gray-800 text-white p-5 mt-5">
      <h2 className="text-2xl font-bold mb-4">Categorías</h2>
      <ul>
        {genres && genres.map((genre) => (
          <li key={genre.id} className="mb-2 cursor-pointer hover:text-gray-400" onClick={() => selectCategory(genre.id)}>
            {genre.name}
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold mt-6 mb-4">Populares</h2>
      <button className="text-left hover:text-gray-400" onClick={fetchPopularMovies}>
        Peliculas Populares
      </button>
      <h2 className="text-2xl font-bold mt-6 mb-4">Mejor Rankeadas</h2>
      <button className="text-left hover:text-gray-400" onClick={fetchTopRatedMovies}>
        Peliculas Mejor Rankeadas
      </button>
    </aside>
  );
};

export default Sidebar;
