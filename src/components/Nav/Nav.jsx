import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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

  /**
   * This function will open or close the drawer menu
   * @param {*} e event that triggers the toggleDrawer function
   * @param {*} open a boolean value indicating if the drawer should be toggled open or closed
   * @returns 
   */
  const toggleDrawer = (e, open) => {
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  }

  /**
   * List of links for admin navigation that is in the MUI drawer menu
   * @returns an MUI List component of nav links
   */
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
        <ListItem>
          <ListItemButton onClick = {() => history.push('/cards')}>
            <ListItemText primaryTypographyProps={{fontSize: '20px'}} primary = {'Manage Cards'}/>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick = {() => history.push('/wholesalers')}>
            <ListItemText primaryTypographyProps={{fontSize: '20px'}} primary = {'Manage Wholesalers'}/>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick = {() => history.push('/pitches')}>
            <ListItemText primaryTypographyProps={{fontSize: '20px'}} primary = {'Manage Pitches'}/>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => dispatch({ type: 'LOGOUT' })}>
            <ListItemText primaryTypographyProps={{fontSize: '20px'}} primary = {'Logout'}/>
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
          // MUI Drawer component enclosed in a fragment
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
