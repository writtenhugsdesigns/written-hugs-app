import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Nav from "../Nav/Nav";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

// Unprotected Routes
import LoginPage from "../LoginPage/LoginPage";

// Protected Routes
import AdminHome from "../AdminHome/AdminHome";
import PitchPage from "../PitchPage/PitchPage";
import CreatePitchPage from "../CreatePitchPage/CreatePitchPage";
import ReviewPitch from "../ReviewPitch/ReviewPitch";
import CardPage from "../CardPage/CardPage";
import CreateCard from "../CreateCard/CreateCard";
import WholesalersPage from "../WholesalersPage/WholesalersPage";
import CreateWholesaler from "../CreateWholesaler/CreateWholesaler";
import CategoriesPage from "../CategoriesPage/CategoriesPage";
import CreateCategory from "../CreateCategory/CreateCategory";
import ViewPitch from "../ViewPitch/ViewPitch";
import EditPitch from "../EditPitch/EditPitch";
import EditCard from "../EditCard/EditCard";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          {/* Visiting localhost:5173 will redirect to localhost:5173/home */}
          <Redirect exact from="/" to="/home" />

          {/* Routes for authenticated and unauthenticated users */}
          <Route exact path="/login">
            {user.id ? (
              // If the user is already logged in,
              // redirect to the /user page
              <Redirect to="/user" />
            ) : (
              // Otherwise, show the login page
              <LoginPage />
            )}
          </Route>

          <Route exact path="/home">
            {user.id ? (
              // If the user is already logged in,
              // redirect them to the /user page
              <Redirect to="/admin" />
            ) : (
              // Otherwise, show the Login page
              <LoginPage />
            )}
          </Route>

          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:5173/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:5173/user */}
          <ProtectedRoute exact path="/admin">
            <AdminHome />
          </ProtectedRoute>

          <ProtectedRoute exact path="/cards">
            <CardPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/createCard">
            <CreateCard />
          </ProtectedRoute>

          <ProtectedRoute exact path="/editcard/:id">
            <EditCard />
          </ProtectedRoute>

          <ProtectedRoute exact path="/pitches">
            <PitchPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/createPitch">
            <CreatePitchPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/reviewPitch">
            <ReviewPitch />
          </ProtectedRoute>

          <ProtectedRoute exact path="/viewPitch/:id">
            <ViewPitch />
          </ProtectedRoute>

          <ProtectedRoute exact path="/editPitch/:id">
            <EditPitch />
          </ProtectedRoute>

          <ProtectedRoute exact path="/wholesalers">
            <WholesalersPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/createWholesaler">
            <CreateWholesaler />
          </ProtectedRoute>

          <ProtectedRoute exact path="/categories">
            <CategoriesPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/createCategory">
            <CreateCategory />
          </ProtectedRoute>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
