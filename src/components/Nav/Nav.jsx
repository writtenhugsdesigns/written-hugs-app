import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import LogOutButton from '../LogOutButton/LogOutButton';

import Drawer  from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import './Nav.css';


function Nav() {
  const user = useSelector((store) => store.user);
  const history = useHistory();
  const dispatch = useDispatch();

  // State for the drawer menu
  const [isOpen, setIsOpen] = useState(false);

  // When user clicks the menu icon, open drawer
  const toggleDrawer = (e, open) => {
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return;
    }
    console.log("Time to open")
    setIsOpen(open);
  }

  // List of hamburger menu options
  const list = () => {
     return (
     <Box
      className = 'navBurger'
      role = "presentation"
      onClick = {(e) => toggleDrawer(e, false)}
      onKeyDown= {(e) => toggleDrawer(e, false)}
    >
      {/* List of navigation options */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick = {() => history.push('/cards')}>
            <ListItemText primary = {'Manage Cards'}/>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick = {() => history.push('/wholesalers')}>
            <ListItemText primary = {'Manage Wholesalers'}/>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick = {() => history.push('/pitches')}>
            <ListItemText primary = {'Manage Pitches'}/>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => dispatch({ type: 'LOGOUT' })}>
            <ListItemText primary = {'Logout'}/>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
    )
  }

  return (
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">Written Hugs</h2>
      </Link>
      <div>
        {/* If no user is logged in, show the login link */}
        {!user.id && (
          <Link className="navLink" to="/login">
            Login
          </Link>
        )}

        {/* If a user is logged in, show the hamburger menu */}
        {user.id && (
          <React.Fragment key = {'right'}>
            <button className = 'navLink' onClick={(e)=>toggleDrawer(e, true)}><MenuIcon></MenuIcon></button>
            <Drawer
                  anchor='right'
                  open={isOpen}
                  onClose={(e) => toggleDrawer(e, false)}
                >
                  {list()}
            </Drawer>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default Nav;
