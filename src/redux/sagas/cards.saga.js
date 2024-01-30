import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
const fs = require('fs')
const { google } = require('googleapis')

const apikeys = require('./googleDriveAPI')

const SCOPE = ["https://www.googleapis.com/auth/drive"];

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

async function authorize() {
  const jwtClient = new google.auth.JWT(
      apikeys.client_email,
      null,
      apikeys.private_key,
      SCOPE
  )
  await jwtClient.authorize();
  return jwtClient;
}

function* getCurrentFolders(authClient) {
  const drive = google.drive({version: 'v3', auth: authClient})
  try {
    const res = await drive.files.list({
      q: 'mimeType=\'application/vnd.google-apps.folder\'',
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive',
    });
    Array.prototype.push.apply(folders, res.data.files);
    return console.log(folders);
  
    allFolders
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
