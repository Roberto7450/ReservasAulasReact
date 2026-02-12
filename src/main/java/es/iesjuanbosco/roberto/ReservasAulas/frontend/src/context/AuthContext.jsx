// Contexto global: gestiona autenticación JWT en toda la app
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decodifica token JWT y extrae email y roles
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      let roles = [];
      if (payload.roles) {
        if (typeof payload.roles === 'string') {
          roles = payload.roles.split(',').map(r => r.trim());
        } else if (Array.isArray(payload.roles)) {
          roles = payload.roles;
        }
      }

      return {
        email: payload.sub,
        roles: roles,
      };
    } catch (e) {
      console.error('Error al decodificar token:', e);
      return null;
    }
  };

  // Al iniciar, verificar si hay token en localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      const userData = decodeToken(storedToken);
      if (userData) {
        setToken(storedToken);
        setUser(userData);
      } else {
        localStorage.removeItem('jwt_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    const userData = decodeToken(newToken);
    if (userData) {
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('jwt_token', newToken);
    } else {
      console.error('Error al decodificar token durante login');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt_token');
  };

  const isAuthenticated = !!token;

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  const isAdmin = hasRole('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, loading, hasRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};