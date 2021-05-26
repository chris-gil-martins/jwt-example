import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setAccessToken } from './store/auth';
import axios from 'axios';
import Navbar from './components/Navbar';
import Routes from './routes';

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: user } = await axios.get('/auth/me');
        dispatch(setUser(user));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      {!loading ? (
        <div>
          <Navbar />
          <Routes />
        </div>
      ) : (
        'Loading'
      )}
    </div>
  );
};

export default App;
