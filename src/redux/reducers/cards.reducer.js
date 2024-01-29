import { combineReducers } from 'redux';

const categories = (state = [], action) => {
    switch (action.type) {
      case 'SET_CATEGORIES':
        return action.payload;
      default:
        return state;
    }
  };

const cardsList = (state = [], action) => {
    switch (action.type) {
      case 'SET_CARDS':
        return action.payload;
      default:
        return state;
    }
};

const selectedCard = (state = {}, action) => {
  if (action.type === 'SET_CARD') {
    return action.payload
  } else if (action.type === 'MODIFY_CARD') {
    const editedProperty = action.payload.property
    const newValue = action.payload.newValue
    return {...state, [editedProperty]: newValue}
  } 
  return state;
};

export default combineReducers({
    categories,
    cardsList,
    selectedCard
});
