import { combineReducers } from "redux";

const wholesalers = (state = [], action) => {
  switch (action.type) {
    case "SET_WHOLESALERS":
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  wholesalers,
});
