import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchAllUser() {
  try {
    const allUsers = yield axios.get('/api/user/all')
    yield put({ type: 'SET_ALL_USER', payload: allUsers.data })
  } catch (error) {
    console.log('User get all request failed', error);
  }
}

function* allUserSaga() {
  yield takeLatest('FETCH_USER', fetchAllUser);
}

export default allUserSaga;
