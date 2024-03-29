import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

/**
 * Send a get request to receive all cards and set the cards reducer
 */
function* fetchAllCards() {
  try {
    const AllCards = yield axios.get("/api/cards");
    yield put({
      type: "SET_CARDS",
      payload: AllCards.data,
    });
  } catch (error) {
    console.log("fetchAllCards error:", error);
  }
}

/**
 * Send a get request to receive all categories and thier corresponding cards and set the cardsByCategory reducer
 */
function* fetchAllCardsByCategory() {
  try {
    const AllCardsByCategory = yield axios.get("/api/cards/byCategory");
    yield put({
      type: "SET_CARDS_BY_CATEGORY",
      payload: AllCardsByCategory.data,
    });
  } catch (error) {
    console.log("AllCardsByCategory error:", error);
  }
}

/**
 * Send a post request to create a new card and then fetch all cards
 * @param {*} action action.payload containing new card data is sent to the router
 */
function* postCard(action) {
  try {
    const headers = {
      "content-type": "multipart/form-data",
    };
    const response = yield axios({
      method: "POST",
      url: "/api/cards",
      headers: headers,
      data: action.payload,
    });

    yield fetchAllCards();
    yield fetchAllCardsByCategory();
    yield getCurrentFolders();
  } catch (error) {
    console.error("Card POST failed:", error);
  }
}

/**
 * Send a delete request to delete a card with specific id, then fetch all cards
 * @param {*} action action.payload containing the card id is sent to the router
 */
function* deleteCard(action) {
  console.log("in delete saga:", action.payload);
  try {
    const response = yield axios({
      method: "DELETE",
      url: `/api/cards?card_id=${action.payload.card_id}&folder_id=${action.payload.folder_id}`,
    });
    yield fetchAllCards();
    yield fetchAllCardsByCategory();
  } catch (error) {
    console.error("Card DELETE failed:", error);
  }
}

/**
 * Send a put request to edit a card with a specific id, then fetch all cards
 * @param {*} action action.payload contains data and an id property for the card to update
 */
function* editCard(action) {
  console.log('card', action.payload);
  try {
    const response = yield axios({
      method: "PUT",
      url: `/api/cards/${action.payload.card.card_id}`,
      data: {
        description: action.payload.card.description,
        upc: action.payload.card.upc,
        categoriesArray: action.payload.categories_array_for_query,
        card_id: action.payload.card.card_id
      },
    });
    yield fetchAllCards();
    yield fetchAllCardsByCategory();
  } catch (error) {
    console.error("Card EDIT failed:", error);
  }
}

function* editCardFile(action) {
  try {
    console.log("this is the data received in editCardFile", action.payload);
    const response = yield axios({
      method: "PUT",
      url: `/api/cards/file/${action.payload.cardId.id}`,
      data: action.payload.fileToSend,
    });
    yield;
    put({
      type: "SAGA/FETCH_CARD",
      payload: action.payload.cardId.id,
    });
  } catch (error) {
    console.error("error updating file for card", error);
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
    yield;
    put({
      type: "SET_CARD",
      payload: card.data,
    });
    console.log(card.data);
  } catch (error) {
    console.log("error in fetchCard:", error);
  }
}

/** This saga function sends a get for all current folders in google drive
 * It returns the folder and puts them in the cards reducer inside currentFolders
 */
function* getCurrentFolders() {
  try {
    const folders = yield axios.get("/api/cards/folders");
    yield put({
      type: "SET_FOLDERS",
      payload: folders.data,
    });
  } catch (error) {
    console.log("fetchCategories error:", error);
  }
}

/**
 * Send a POST request to create a new category for a card and then add that
 * category to the card's categories
 * @param {*} action action.payload contains the new category object
 */
function* postCardCategory(action) {
  try {
    const response = yield axios({
      method: "POST",
      url: "/api/cards/newCategory",
      data: action.payload,
    });
    yield put({
      type: "SAGA/FETCH_CARD",
      payload: response.data.id,
    });
    // yield fetchAllCards();
  } catch (error) {
    console.error("postCardCategory failed:", error);
  }
}

/**
 * add an existing category to a card's categories
 * @param {*} action action.payload contains the category  object
 */
function* postCardExistingCategory(action) {
  try {
    const response = yield axios({
      method: "POST",
      url: "/api/cards/existingCategory",
      data: action.payload,
    });
    yield put({
      type: "SAGA/FETCH_CARD",
      payload: response.data.id,
    });
    // yield fetchAllCards();
  } catch (error) {
    console.error("postCardCategory failed:", error);
  }
}

function* cardSaga() {
  yield takeLatest("SAGA/POST_CARD", postCard);
  yield takeLatest("SAGA/POST_CARD_CATEGORY", postCardCategory);
  yield takeLatest(
    "SAGA/POST_CARD_EXISTING_CATEGORY",
    postCardExistingCategory
  );
  yield takeLatest("SAGA/FETCH_CARDS", fetchAllCards);
  yield takeLatest("SAGA/FETCH_CARDS_BY_CATEGORY", fetchAllCardsByCategory);
  yield takeLatest("SAGA/DELETE_CARD", deleteCard);
  yield takeLatest("SAGA/EDIT_CARD", editCard);
  yield takeLatest("SAGA/GET_FOLDERS", getCurrentFolders);
  yield takeLatest("SAGA/FETCH_CARD", fetchCard);
  yield takeLatest("SAGA/EDIT_CARD_FILE", editCardFile);
}

export default cardSaga;
