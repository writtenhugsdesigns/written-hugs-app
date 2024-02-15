const allUsersReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_ALL_USER':
      return action.payload;
    case 'UNSET_USER':
      return [];
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default allUsersReducer;
