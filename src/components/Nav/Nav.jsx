import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
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

  const list = () => {
     return (
     <Box
      sx={250}
      role = "presentation"
      onClick = {(e) => toggleDrawer(e, false)}
      onKeyDown= {(e) => toggleDrawer(e, false)}
    >
      {/* List of navigation options */}
      <List>
        {['Manage Cards', 'Manage Wholesalers', 'Manage Pitches'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary = {text}/>
            </ListItemButton>
          </ListItem>
        ))}
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
        <Link className="navLink" to="/about">
          About
        </Link>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className="navLink" to="/login">
            Login
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link className="navLink" to="/admin">
              Admin Home
            </Link>

            <LogOutButton className="navLink" />
          </>
        )}
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
      </div>
    </div>
  );
}

export default Nav;
