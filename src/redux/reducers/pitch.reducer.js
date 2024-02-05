import { combineReducers } from 'redux';

const pitches = (state = [], action) => {
  switch (action.type) {
    case "SET_PITCHES":
      return action.payload;
    default:
      return state;
  }
};

const newPitch = (state = [], action) => {
  if (action.type === 'ADD_CARD_TO_PITCH') {
    return [...state, action.payload]
  }
  if (action.type === 'REMOVE_CARD_FROM_PITCH') {
    return state.filter((card) => {
      return card.id != action.payload.id
    })
  }
  if (action.type === 'CLEAR_PITCH') {
    return []
  }
  return state;
}

export default combineReducers({
  pitches,
  newPitch
});