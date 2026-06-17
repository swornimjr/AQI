import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/auth/me')
      .then((res) => setCurrentUser(res.data))
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = async (username, email, password) => {
    const res = await axios.post('/api/auth/register', { username, email, password });
    setCurrentUser(res.data);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setCurrentUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
