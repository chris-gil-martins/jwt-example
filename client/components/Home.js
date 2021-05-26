import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Home = () => {
  const { id, username } = useSelector((state) => state.auth.user);
  const [secret, setSecret] = useState(null);

  const getSecret = async () => {
    try {
      const { data: secret } = await axios.get(`/api/secrets/${id}`);
      setSecret(secret.secret);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Welcome, {username}</h3>
      <button onClick={getSecret}>Get Secret</button>
      {!!secret && <h4>Your secret is: {secret}</h4>}
    </div>
  );
};

export default Home;
