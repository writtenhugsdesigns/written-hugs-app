import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerCode, setRegisterCode] = useState('');
  const errors = useSelector(store => store.errors);
  const allUsers = useSelector(store => store.allUsersReducer)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "FETCH_USER" })
  }, []);

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

  const register = (event) => {
    event.preventDefault()
    if (username && password) {
      dispatch({
        type: "REGISTER",
        payload: {username, password, registerCode}
      })
    } else {
      dispatch({type: 'REGISTRATION_INPUT_ERROR'})
    }
  }

  return (
    <form className="formPanel" onSubmit={login}>
      {allUsers[0] && <>
        <h2>Login</h2>
        {errors.loginMessage && (
          <h3 className="alert" role="alert">
            {errors.loginMessage}
          </h3>
        )}
        <div>
          <label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            Password:
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        </div>
        <div>
          <input className="btn" type="submit" name="submit" value="Log In" />
        </div>
      </>}
      {!allUsers[0] && <>
        <h2>Register</h2>
        {errors.registrationMessage && (
          <h3 className="alert" role="alert">
            {errors.registrationMessage}
          </h3>
        )}
        <div>
          <label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            Password:
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="registerCode">
            Register Code:
            <input
              type="registerCode"
              name="registerCode"
              required
              value={registerCode}
              onChange={(event) => setRegisterCode(event.target.value)}
            />
          </label>
        </div>
        <div>
          <input onClick={register} className="btn" type="submit" name="submit" value="Register" />
        </div>
      </>}
      </form>
      
  );
}

export default LoginForm;
