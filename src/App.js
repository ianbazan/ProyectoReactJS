// src/App.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { FaArrowUp } from 'react-icons/fa';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import { UserContext } from './context/UserContext';
import './App.css';
import './index.css';

function App() {
  const API_URL = 'https://api.themoviedb.org/3/';
  const API_KEY = '8a8dee24072130d201f879d11f5b023c';
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original';

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);
  const [genres, setGenres] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);

  const { user, logout } = useContext(UserContext);

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


  // Fetch de películas basadas en búsqueda
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const { data: { results } } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });

    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      await fetchMovie(results[0].id);
    }
  };

  // Fetch de detalles de una película específica
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos"
      }
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);
  };

  // Fetch de géneros de películas
  const fetchGenres = async () => {
    const { data: { genres } } = await axios.get(`${API_URL}/genre/movie/list`, {
      params: {
        api_key: API_KEY,
      },
    });
    setGenres(genres);
  };

  // Fetch de películas por género
  const fetchMoviesByGenre = async (genreId) => {
    const { data: { results } } = await axios.get(`${API_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        with_genres: genreId,
      },
    });
    setMovies(results);
    setMovie(results[0]);
  };

  // Fetch de películas populares
  const fetchPopularMovies = async () => {
    const { data: { results } } = await axios.get(`${API_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
      },
    });
    setPopularMovies(results);
  };

  // Fetch de películas mejor rankeadas
  const fetchTopRatedMovies = async () => {
    const { data: { results } } = await axios.get(`${API_URL}/movie/top_rated`, {
      params: {
        api_key: API_KEY,
      },
    });
    setTopRatedMovies(results);
  };

  const selectMovie = async (movie) => {
    fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0, 0);
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
    fetchGenres();
    fetchPopularMovies();
    fetchTopRatedMovies();
  }, [fetchMovies, fetchGenres, fetchPopularMovies, fetchTopRatedMovies]);

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
            movies={movies}
            trailer={trailer}
            playing={playing}
            setPlaying={setPlaying}
            movie={movie}
            IMAGE_PATH={IMAGE_PATH}
            popularMovies={popularMovies}
            topRatedMovies={topRatedMovies}
            fetchPopularMovies={fetchPopularMovies}
            fetchTopRatedMovies={fetchTopRatedMovies}
            fetchMoviesByGenre={fetchMoviesByGenre}
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
