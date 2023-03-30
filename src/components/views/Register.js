import React, { useState } from 'react';
import { api } from 'helpers/api';
import User from 'models/User';
import { useHistory, Link } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from 'components/ui/BaseContainer';
import FormField from 'components/ui/FormField';

const Register = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const doRegister = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('uid', user.id);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
    } catch (error) {
      //alert(`Something went wrong during the login: \n${handleError(error)}`);
      alert(error.response.data?.message || 'Registration failed.');
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <h1>Register</h1>
        <form className="login form" onSubmit={(e) => doRegister(e)}>
          <FormField
            label="Username"
            value={username}
            onChange={(un) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            type="password"
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={(e) => doRegister(e)}
            >
              Register
            </Button>
          </div>
          <Link to="/login" className="login link">
            Go to Login
          </Link>
        </form>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Register;
