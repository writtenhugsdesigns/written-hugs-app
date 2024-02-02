import { combineReducers } from 'redux';

const cardsList = (state = [], action) => {
    switch (action.type) {
      case 'SET_CARDS':
        return action.payload;
      default:
        return state;
    }
};

const cardsListByCategory = (state = [], action) => {
  switch (action.type) {
    case 'SET_CARDS_BY_CATEGORY':
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

//This stores the current folders in google drive.
//This is populated in an onEffect of the create new card page
const currentFolders = (state = [], action) => {
  if (action.type === 'SET_FOLDERS'){
    return action.payload
  } 
  return state
}

export default combineReducers({
    cardsList,
    cardsListByCategory,
    selectedCard,
    currentFolders
});
