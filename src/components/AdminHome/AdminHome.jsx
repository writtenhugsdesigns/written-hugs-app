import React from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';

function AdminHome() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  const history = useHistory();

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>

      <button onClick = {() => history.push("/cards")}>Manage Cards</button>
      <button onClick = {() => history.push("/wholesalers")}>Manage Wholesalers</button>
      <button onClick = {() => history.push("/pitches")}>Manage Pitches</button>
      
    </div>
  );
}

// this allows us to use <App /> in index.js
export default AdminHome;
