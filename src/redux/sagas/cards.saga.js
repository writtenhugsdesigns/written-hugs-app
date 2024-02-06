import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

/**
 * Send a get request to receive all cards and set the cards reducer
 */
function* fetchAllCards() {
    try {
      const AllCards = yield axios.get('/api/cards');
      yield put({
        type: 'SET_CARDS',
        payload: AllCards.data
      });
    } catch (error) {
      console.log('fetchAllCards error:', error);
    }
}

/**
 * Send a get request to receive all categories and thier corresponding cards and set the cardsByCategory reducer
 */
function* fetchAllCardsByCategory() {
  try {
    const AllCardsByCategory = yield axios.get('/api/cards/byCategory');
    yield put({
      type: 'SET_CARDS_BY_CATEGORY',
      payload: AllCardsByCategory.data
    });
  } catch (error) {
    console.log('AllCardsByCategory error:', error);
  }
}

/**
 * Send a post request to create a new card and then fetch all cards
 * @param {*} action action.payload containing new card data is sent to the router
 */
function* postCard(action) {
    try {
        const headers = {
          'content-type' : 'multipart/form-data'
        }
        const response = yield axios({
            method: 'POST',
            url: '/api/cards',
            headers: headers,
            data: action.payload
        })
        
        yield fetchAllCards()
    }
    catch (error) {
        console.error('Card POST failed:', error)
    }
}

/**
 * Send a delete request to delete a card with specific id, then fetch all cards
 * @param {*} action action.payload containing the card id is sent to the router
 */
function* deleteCard(action) {
    try {
        const response = yield axios({
            method: 'DELETE',
            url: `/api/cards/${action.payload}`
        })
        yield fetchAllCards()
    }
    catch (error) {
        console.error('Card DELETE failed:', error)
    }
}

/**
 * Send a put request to edit a card with a specific id, then fetch all cards
 * @param {*} action action.payload contains data and an id property for the card to update
 */
function* editCard(action) {
    try {
        const response = yield axios({
            method: 'PUT',
            url: `/api/cards/${action.payload.id}`,
            data: action.payload.data
        })
        yield fetchAllCards()
    }
    catch (error) {
        console.error('Card EDIT failed:', error)
    }
}

/**
 * Send a get request to receive one card by id from the server, and set the card reducer
 * @param {*} action action.payload contains the id of the desired card
 */
function* fetchCard(action) {
  try {
    const cardID = action.payload;
    const card = yield axios.get(`/api/cards/${cardID}`);
    yield put({
      type: 'SET_CARD',
      payload: card.data
    });
  } catch (error) {
    console.log('error in fetchCard:', error);
  }
    }


/** This saga function sends a get for all current folders in google drive
 * It returns the folder and puts them in the cards reducer inside currentFolders
 */
function* getCurrentFolders() {
  try {
    const folders = yield axios.get('/api/cards/folders');
    yield put({
      type: 'SET_FOLDERS',
      payload: folders.data
    });
  } catch (error) {
    console.log('fetchCategories error:', error);
  }
}

function* cardSaga() {
  yield takeLatest('SAGA/POST_CARD', postCard);
  yield takeLatest('SAGA/FETCH_CARDS', fetchAllCards);
  yield takeLatest('SAGA/FETCH_CARDS_BY_CATEGORY', fetchAllCardsByCategory);
  yield takeLatest('SAGA/DELETE_CARD', deleteCard);
  yield takeLatest('SAGA/EDIT_CARD', editCard);
  yield takeLatest('SAGA/GET_FOLDERS', getCurrentFolders)
  yield takeLatest('SAGA/FETCH_CARD', fetchCard);
}

export default cardSaga;
