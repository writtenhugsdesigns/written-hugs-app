import { combineReducers } from 'redux';

/**
 * @returns a boolean value indicating whether a specific card has been added
 *  to the pitch cart
 */
const isInCart = (card, cart) => {
    for(let object of cart){
        if(object.card_id == card.card_id){
            return true;
        }
    }
    return false;
}

const cart = (state = [], action) => {
    if(action.type === 'ADD_CARD_TO_CART'){
        return [...state, action.payload]
    } else if(action.type === 'REMOVE_CARD_FROM_CART'){
        return state.filter((card) => {
            return card.card_id !== action.payload.card_id;
        })
    } else if(action.type === 'ADD_CATEGORY_TO_CART'){
        const cards = action.payload.filter((card) => {
            return !isInCart(card, state);
        });
        return [...state, ...cards];
    } else if(action.type === 'REMOVE_CATEGORY_FROM_CART'){
        const cards = action.payload;
        let filteredState = [...state];
        for(let card of cards){
            filteredState = filteredState.filter((cartItem) => {
                return card.card_id !== cartItem.card_id;
            })
        }
        return filteredState;
    } else if(action.type === 'GET_CART'){
        return state;
    } else if(action.type === 'CLEAR_CART'){
        return [];
    } else {
        return state;
    }
}

export default combineReducers({
    cart
})