// src/App.js
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { FaSearch, FaArrowUp } from 'react-icons/fa';
import { Routes, Route, Link } from 'react-router-dom';
import useSWR from 'swr'; // Importar SWR
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import { UserContext } from './context/UserContext';
import './App.css';
import './index.css';

const API_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '8a8dee24072130d201f879d11f5b023c';
const IMAGE_PATH = 'https://image.tmdb.org/t/p/original';

// Función fetcher para usar en SWR
const fetcher = (url) => fetch(url).then(res => res.json());

function App() {
  const [searchKey, setSearchKey] = useState("");
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);
  const [trailer, setTrailer] = useState(null);

  const { user, logout } = useContext(UserContext);

  // Fetch de películas por búsqueda (SWR)
  const { data: movies, error: movieError, isLoading: movieLoading } = useSWR(
    searchKey ? `${API_URL}search/movie?api_key=${API_KEY}&query=${searchKey}` : `${API_URL}discover/movie?api_key=${API_KEY}`, 
    fetcher
  );

  // Fetch de géneros (SWR)
  const { data: genreData } = useSWR(`${API_URL}genre/movie/list?api_key=${API_KEY}`, fetcher);
  const genres = genreData?.genres || [];

  // Fetch de películas populares (SWR)
  const { data: popularData } = useSWR(`${API_URL}movie/popular?api_key=${API_KEY}`, fetcher);
  const popularMovies = popularData?.results || [];

  // Fetch de películas mejor rankeadas (SWR)
  const { data: topRatedData } = useSWR(`${API_URL}movie/top_rated?api_key=${API_KEY}`, fetcher);
  const topRatedMovies = topRatedData?.results || [];

  // Scroll hacia arriba 
  const [showScrollButton, setShowScrollButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 1500) { 
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Para hacer el scroll suave
    });
  };

  // Selección de película
  const selectMovie = (selectedMovie) => {
    fetchMovieDetails(selectedMovie.id);
    setMovie(selectedMovie);
    window.scrollTo(0, 0);
  };

  // Fetch de detalles de una película específica
  const fetchMovieDetails = useCallback(async (id) => {
    const url = `${API_URL}movie/${id}?api_key=${API_KEY}&append_to_response=videos`;
    const data = await fetcher(url);
    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);
  }, []);

  // Búsqueda de películas
  const searchMovies = (e) => {
    e.preventDefault();
  };

  if (movieLoading) return <div>Loading movies...</div>;
  if (movieError) return <div>Error loading movies</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <header className="bg-gradient-to-r from-purple-950 via-pink-950 to-red-950 py-4 p-3">
        <nav className="container mx-auto flex items-center justify-between px-4">
          <h1 className='text-3xl font-bold text-white'>
            <Link to="/">MoviesApp</Link>
          </h1>
          <form className='flex items-center' onSubmit={searchMovies}>
            <input 
              type='text' 
              onChange={(e) => setSearchKey(e.target.value)} 
              className='border border-gray-300 p-1 rounded-l-md text-black'
            />
            <button className='bg-slate-950 text-white p-2.5 rounded-r-md'>
              <FaSearch />
            </button> 
          </form>
          <ul className='flex space-x-4'>
            {user ? (
              <>
                <li>
                  <Link className='hover:text-gray-400' to="/favorites">Mis Favoritos</Link>
                </li>
                <li>
                  <button className='hover:text-gray-400' onClick={logout}>Cerrar Sesión</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className='hover:text-gray-400' to="/login">Login</Link>
                </li>
                <li>
                  <Link className='hover:text-gray-400' to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={
          <Home
            selectMovie={selectMovie}
            movies={movies?.results || []}
            trailer={trailer}
            playing={playing}
            setPlaying={setPlaying}
            movie={movie}
            IMAGE_PATH={IMAGE_PATH}
            popularMovies={popularMovies}
            topRatedMovies={topRatedMovies}
            genres={genres} // Pasando géneros a Home
          />
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<Favorites selectMovie={selectMovie} />} />
      </Routes>
      {showScrollButton && (
        <button
          className="scroll-to-top-button fixed bottom-10 right-10 p-3 bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none"
          onClick={scrollToTop}
        >
          <FaArrowUp className="text-white"/>
        </button>
      )}
    </div>
  );
}

export default App;
