import React from 'react';
import LoginForm from '../LoginForm/LoginForm';

function LoginPage() {
  return (
    <div>
      <LoginForm />

      <center>
        <button
          type="button"
          className="btn btn_asLink"
        >
          Forgot Password?
        </button>
      </center>
    </div>
  );
}

export default LoginPage;
