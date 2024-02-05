import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* fetchPitches() {
  try {
    const pitches = yield axios.get("/api/pitches");
    yield put({
      type: "SET_PITCHES",
      payload: pitches.data,
    });
  } catch (error) {
    console.log("fetchPitches error:", error);
  }
}

function* postPitch(action) {
  try {
    const response = yield axios({
      method: "POST",
      url: "/api/pitches",
      data: action.payload,
    });
    yield fetchPitches();
  } catch (error) {
    console.error("postPitch failed:", error);
  }
}

function* deletePitch(action) {
  try {
    const response = yield axios({
      method: "DELETE",
      url: `/api/pitches/${action.payload}`,
    });
    yield fetchPitches();
  } catch (error) {
    console.error("deletePitch failed:", error);
  }
}

function* editPitch(action) {
  try {
    const response = yield axios({
      method: "PUT",
      url: `/api/pitches/${action.payload.id}`,
      data: action.payload.data,
    });
    yield fetchPITCHES();
  } catch (error) {
    console.error("editPitch failed:", error);
  }
}

function* pitchSaga() {
  yield takeLatest("SAGA/FETCH_PITCHES", fetchPitches);
  yield takeLatest("SAGA/POST_PITCH", postPitch);
  yield takeLatest("SAGA/DELETE_PITCH", deletePitch);
  yield takeLatest("SAGA/EDIT_PITCH", editPitch);
}

export default pitchSaga;
