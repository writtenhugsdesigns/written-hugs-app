import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* fetchWholesalers() {
  try {
    const wholesalers = yield axios.get("/api/wholesalers");
    yield put({
      type: "SET_WHOLESALERS",
      payload: wholesalers.data,
    });
  } catch (error) {
    console.log("fetchWholesalers error:", error);
  }
}

function* postWholesaler(action) {
  try {
    const response = yield axios({
      method: "POST",
      url: "/api/wholesalers",
      data: action.payload,
    });
    yield fetchWholesalers();
  } catch (error) {
    console.error("postWholesaler failed:", error);
  }
}

function* deleteWholesaler(action) {
  try {
    const response = yield axios({
      method: "DELETE",
      url: `/api/wholesalers/${action.payload}`,
    });
    yield fetchWholesalers();
  } catch (error) {
    console.error("deleteWholesaler failed:", error);
  }
}

function* editWholesaler(action) {
  try {
    console.log(action.payload.company_name);
    const response = yield axios({
      method: "PUT",
      url: `/api/wholesalers/${action.payload.id}`,
      data: action.payload,
    });
    yield fetchWholesalers();
  } catch (error) {
    console.error("editWholesaler failed:", error);
  }
}

function* wholesalerSaga() {
  yield takeLatest("SAGA/FETCH_WHOLESALERS", fetchWholesalers);
  yield takeLatest("SAGA/POST_WHOLESALER", postWholesaler);
  yield takeLatest("SAGA/DELETE_WHOLESALER", deleteWholesaler);
  yield takeLatest("SAGA/EDIT_WHOLESALER", editWholesaler);
}

export default wholesalerSaga;
