import { combineReducers } from "redux";

const categories = (state = [], action) => {
  switch (action.type) {
    case "SET_CATEGORIES":
      return action.payload;
    default:
      return state;
  }
};

const currentCategory = (state = {}, action) => {
  switch (action.type) {
    case "SET_CURRENT_CATEGORY":
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
  categories,
  currentCategory
});
