import { combineReducers } from "redux";

const wholesalers = (state = [], action) => {
  switch (action.type) {
    case "SET_WHOLESALERS":
      return action.payload;
    default:
      return state;
  }
};

const currentWholesaler = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CURRENT_WHOLESALER':
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
  wholesalers,
  currentWholesaler
});
