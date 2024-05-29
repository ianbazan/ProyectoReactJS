import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // useEffect para cargar datos de cookies y localStorage al iniciar la aplicación
  useEffect(() => {
    const savedUser = Cookies.get('user'); // Obtener usuario desde las cookies
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Función para iniciar sesión y guardar usuario en cookies
  const login = (userData) => {
    setUser(userData);
    Cookies.set('user', JSON.stringify(userData), { expires: 7 }); // Guardar usuario en cookies por 7 días
  };

  // Función para cerrar sesión y eliminar usuario de cookies
  const logout = () => {
    setUser(null);
    Cookies.remove('user'); // Eliminar usuario de cookies
  };

  // Función para agregar película a favoritos y guardarlos en localStorage
  const addFavorite = (movie) => {
    const updatedFavorites = [...favorites, movie];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Función para eliminar película de favoritos y actualizarlos en localStorage
  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(movie => movie.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const value = {
    user,
    favorites,
    login,
    logout,
    addFavorite,
    removeFavorite,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
