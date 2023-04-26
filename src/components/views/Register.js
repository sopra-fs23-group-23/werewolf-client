import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { api } from 'helpers/api';
import User from 'models/User';
import FormField from 'components/ui/FormField';
import 'styles/views/Auth.scss';
import StorageManager from 'helpers/StorageManager';

const Register = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const doRegister = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post('/users', requestBody);

      const user = new User(response.data);
      console.log("User: ", user);

      StorageManager.setUserToken(user.token);
      StorageManager.setUserId(user.id);
      StorageManager.setUsername(user.username);

      history.push(`/home`);
    } catch (error) {
      alert(error.response.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="background background-light">
      <div className="container">
        <div className="auth">
          <div className="column-container">
            <h1>Register</h1>
            <form onSubmit={(e) => doRegister(e)}>
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
              <button
                className="btn"
                disabled={!username || !password}
                onClick={(e) => doRegister(e)}
              >
                Register
              </button>
              <Link to="/login" className="link"
              >
                Go to Login
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
