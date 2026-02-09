import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para decodificar token y extraer información del usuario
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Extraer roles del payload - pueden venir como string separado por comas o como array
      let roles = [];
      if (payload.roles) {
        if (typeof payload.roles === 'string') {
          // Si es string, dividir por comas
          roles = payload.roles.split(',').map(r => r.trim());
        } else if (Array.isArray(payload.roles)) {
          // Si ya es array, usar directamente
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

  // Cargar token del localStorage al iniciar
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

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  // Verificar si el usuario es administrador
  const isAdmin = hasRole('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, loading, hasRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
