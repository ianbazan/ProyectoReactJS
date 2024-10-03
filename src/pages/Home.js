import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import MovieCard from '../components/MovieCard';
import Sidebar from '../components/Sidebar';
import PopularMovies from '../components/PopularMovies';
import TopRatedMovies from '../components/TopRatedMovies';

const Home = ({ selectMovie, movies, trailer, playing, setPlaying, movie, IMAGE_PATH, popularMovies, topRatedMovies, fetchPopularMovies, fetchTopRatedMovies, fetchMoviesByGenre, genres }) => {
  const [filteredMovies, setFilteredMovies] = useState([]);
  
  // Referencias Películas Populares y Mejor Rankeadas
  const popularMoviesRef = useRef(null);
  const topRatedMoviesRef = useRef(null);

  useEffect(() => {
    setFilteredMovies(movies);
  }, [movies]);

  const fetchMoviesByCategory = async (categoryId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${categoryId}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer 2bd4cead62c3c6f2bfcfd7e8997bc617'
                
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching movies by category: ${response.status}`);
        }

        const data = await response.json();
        setFilteredMovies(data.results);
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
};

  return (
    <div className='flex'>
      <Sidebar
          selectCategory={fetchMoviesByCategory} // Aquí llamas a fetchMoviesByCategory
          fetchPopularMovies={() => {
              fetchPopularMovies();
              popularMoviesRef.current.scrollIntoView({ behavior: 'smooth' });
          }}
          fetchTopRatedMovies={() => {
              fetchTopRatedMovies();
              topRatedMoviesRef.current.scrollIntoView({ behavior: 'smooth' });
          }}
          genres={genres}
      />
      <div className='flex-grow p-5'>
        <main>
          {movie && (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer?.key}  // Asegurando que trailer tenga valor
                    className='reproductor container mx-auto'
                    containerClassName={"youtube-container"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className='boton'>
                    Close
                  </button>
                </>
              ) : (
                <div className="container mx-auto p-4">
                  <div>
                    {trailer ? (
                      <button
                        className='boton bg-black text-white px-4 py-2 rounded'
                        onClick={() => setPlaying(true)}
                        type='button'
                      >
                        Play trailer
                      </button> 
                    ) : (
                      "Disculpa, no hay trailer"
                    )}
                    <h1 className='text-white text-4xl font-bold'>{movie.title}</h1>
                    <p className='text-white mt-4'>{movie.overview}</p>
                    <p className='text-white mt-2'>Calificación: {movie.vote_average}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        <div className='container mx-auto mt-12'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} selectMovie={selectMovie} URL_IMAGE={IMAGE_PATH} />
            ))}
          </div>
        </div>

        <div ref={popularMoviesRef} className='container mx-auto mt-12'>
          <PopularMovies movies={popularMovies} selectMovie={selectMovie} URL_IMAGE={IMAGE_PATH} />
        </div>
        <div ref={topRatedMoviesRef} className='container mx-auto mt-12'>
          <TopRatedMovies movies={topRatedMovies} selectMovie={selectMovie} URL_IMAGE={IMAGE_PATH} />
        </div>
      </div>
    </div>
  );
};

export default Home;
