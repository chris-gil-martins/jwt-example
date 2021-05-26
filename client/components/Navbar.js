import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken, setUser } from '../store/auth';
import axios from 'axios';

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleClick = async () => {
    try {
      await axios.post('/auth/logout');
      dispatch(setUser(null));
      dispatch(setAccessToken(null));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>JWT Example</h1>
      <nav>
        {!!user ? (
          <div>
            <Link to="/home">Home</Link>
            <button onClick={handleClick}>Logout</button>
          </div>
        ) : (
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        )}
      </nav>
      <hr />
    </div>
  );
};

export default Navbar;
