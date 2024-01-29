import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchCategories() {
    try {
      const Categories = yield axios.get('/api/categories');
      yield put({
        type: 'SET_CATEGORIES',
        payload: Categories.data
      });
    } catch (error) {
      console.log('fetchCategories error:', error);
    }
}

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

function* postCard(action) {
    try {
        const response = yield axios({
            method: 'POST',
            url: '/api/cards',
            data: action.payload
        })
        yield fetchAllCards()
    }
    catch (error) {
        console.error('Card POST failed:', error)
    }
}

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

  function* cardSaga() {
    yield takeLatest('SAGA/FETCH_CATEGORIES', fetchCategories);
    yield takeLatest('SAGA/POST_CARD', postCard);
    yield takeLatest('SAGA/FETCH_CARDS', fetchAllCards);
    yield takeLatest('SAGA/DELETE_CARD', deleteCard);
    yield takeLatest('SAGA/EDIT_CARD', editCard);
  }

export default cardSaga;
