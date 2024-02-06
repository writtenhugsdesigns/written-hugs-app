import { combineReducers } from 'redux';

const cart = (state = [], action) => {
    if(action.type = 'ADD_TO_CART'){
        return [...state, action.payload]
    } else if(action.type = 'REMOVE_FROM_CART'){
        return state.filter((card) => {
            return card.id != action.payload.id
        })
    } else if(action.type = 'GET_CART_SIZE'){
        return state.length;
    } else if(action.type = 'GET_CART'){
        return state;
    } else if(action.type = 'CLEAR_CART'){
        return [];
    }
}

export default combineReducers({
    cart
})