import React from 'react';
import { useHistory } from 'react-router-dom';
import './AdminHome.css';

function AdminHome() {
  const history = useHistory();

  return (
    <div className="container">
      <div className = 'adminMenu'>
        <button className = 'adminMenuItem' onClick = {() => history.push("/cards")}>Manage Cards</button>
        <button className = 'adminMenuItem' onClick = {() => history.push("/wholesalers")}>Manage Wholesalers</button>
        <button className = 'adminMenuItem' onClick = {() => history.push("/pitches")}>Manage Pitches</button>
      </div>
    </div>
  );
}


export default AdminHome;
