import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* fetchCategories() {
  try {
    const categories = yield axios.get("/api/categories");
    yield put({
      type: "SET_CATEGORIES",
      payload: categories.data,
    });
  } catch (error) {
    console.log("fetchCategories error:", error);
  }
}

function* postCategory(action) {
  try {
    const response = yield axios({
      method: "POST",
      url: "/api/categories",
      data: action.payload,
    });
    yield fetchCategories();
  } catch (error) {
    console.error("postCategory failed:", error);
  }
}

function* deleteCategory(action) {
  try {
    const response = yield axios({
      method: "DELETE",
      url: `/api/categories/${action.payload}`,
    });
    yield fetchcategories();
  } catch (error) {
    console.error("deleteCategory failed:", error);
  }
}

function* editCategory(action) {
  try {
    const response = yield axios({
      method: "PUT",
      url: `/api/category/${action.payload.id}`,
      data: action.payload.data,
    });
    yield fetchCategories();
  } catch (error) {
    console.error("editCategory failed:", error);
  }
}

function* categorySaga() {
  yield takeLatest("SAGA/FETCH_CATEGORIES", fetchCategories);
  yield takeLatest("SAGA/POST_CATEGORY", postCategory);
  yield takeLatest("SAGA/DELETE_CATEGORY", deleteCategory);
  yield takeLatest("SAGA/EDIT_CATEGORY", editCategory);
}

export default categorySaga;