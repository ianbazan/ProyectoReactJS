// src/components/Header.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Header = ({ searchMovies, setSearchKey }) => {
  const { user, logout } = useContext(UserContext);

  return (
    <header className="bg-gray-800 p-6 flex justify-between items-center">
      <Link to="/" className="text-white text-2xl">Movie App</Link>
      <form onSubmit={searchMovies} className="ml-6">
        <input 
          type="text" 
          onChange={(e) => setSearchKey(e.target.value)} 
          placeholder="Search" 
          className="p-2 rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 rounded ml-2 text-white">Search</button>
      </form>
      <div className="ml-6">
        {user ? (
          <button onClick={logout} className="p-2 bg-red-500 rounded ml-2 text-white">Logout</button>
        ) : (
          <>
            <Link to="/login" className="p-2 bg-blue-500 rounded ml-2 text-white">Login</Link>
            <Link to="/register" className="p-2 bg-green-500 rounded ml-2 text-white">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
