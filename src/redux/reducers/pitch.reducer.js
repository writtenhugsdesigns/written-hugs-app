import { combineReducers } from 'redux';

const pitches = (state = [], action) => {
  switch (action.type) {
    case "SET_PITCHES":
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  pitches
});