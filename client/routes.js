import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Login, SignUp } from './components/AuthForm';
import Home from './components/Home';

const Routes = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div>
      {!!user ? (
        <Switch>
          <Route path="/home" component={Home} />
          <Redirect to="/home" />
        </Switch>
      ) : (
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Redirect to="/" />
        </Switch>
      )}
    </div>
  );
};

export default Routes;
