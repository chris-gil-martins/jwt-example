import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAccessToken, setUser } from '../store/auth';
import axios from 'axios';

export const Login = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const username = evt.target.username.value;
      const password = evt.target.password.value;
      const { data } = await axios.post('/auth/login', { username, password });
      dispatch(setAccessToken(data.accessToken));
      const { data: user } = await axios.get('/auth/me');
      dispatch(setUser(user));
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">
            <small>Username</small>
          </label>
          <input name="username" type="text" />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
    </div>
  );
};

export const SignUp = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const username = evt.target.username.value;
      const password = evt.target.password.value;
      const { data } = await axios.post('/auth/signup', { username, password });
      dispatch(setAccessToken(data.accessToken));
      const { data: user } = await axios.get('/auth/me');
      dispatch(setUser(user));
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">
            <small>Username</small>
          </label>
          <input name="username" type="text" />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
    </div>
  );
};
