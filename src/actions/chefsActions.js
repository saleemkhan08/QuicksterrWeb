import { firestore } from "../store";
import { USERS, RESTAURANT_ID, TYPE } from "./navigationActions";
export const CHEFS = "chef";

export const ADD_CHEFS = "ADD_CHEFS";
export const ADD_CHEFS_BEGIN = "ADD_CHEFS_BEGIN";
export const ADD_CHEFS_SUCCESS = "ADD_CHEFS_SUCCESS";
export const ADD_CHEFS_ERROR = "ADD_CHEFS_ERROR";

export const FETCH_CHEFS = "FETCH_CHEFS";
export const FETCH_CHEFS_BEGIN = "FETCH_CHEFS_BEGIN";
export const FETCH_CHEFS_SUCCESS = "FETCH_CHEFS_SUCCESS";
export const FETCH_CHEFS_ERROR = "FETCH_CHEFS_ERROR";

export const DELETE_CHEFS = "DELETE_CHEFS";
export const DELETE_CHEFS_BEGIN = "DELETE_CHEFS_BEGIN";
export const DELETE_CHEFS_SUCCESS = "DELETE_CHEFS_SUCCESS";
export const DELETE_CHEFS_ERROR = "DELETE_CHEFS_ERROR";
export const EMAIL = "email";
export function fetchChefs(restaurantId) {
  return dispatch => {
    dispatch(fetchChefsBegin());
    const chefsRef = firestore.collection(USERS);
    const query = chefsRef
      .where(RESTAURANT_ID, "==", restaurantId)
      .where(TYPE, "==", CHEFS);
    query.onSnapshot(querySnapshot => {
      const chefs = [];
      querySnapshot.forEach(doc => {
        chefs.push(doc.data());
      });
      dispatch(fetchChefsSuccess(chefs));
    });
  };
}

export const fetchChefsBegin = () => ({
  type: FETCH_CHEFS_BEGIN
});

export const fetchChefsSuccess = chefs => ({
  type: FETCH_CHEFS_SUCCESS,
  payload: chefs
});

export const fetchChefsError = error => ({
  type: FETCH_CHEFS_ERROR,
  payload: { error }
});

export function addChefs(restaurantId, email) {
  return dispatch => {
    dispatch(addChefsBegin());
    const userCollectionRef = firestore.collection(USERS);
    const waiterRef = userCollectionRef.where(EMAIL, "==", email);
    waiterRef
      .get()
      .then(snapShot => {
        snapShot.forEach(doc => {
          userCollectionRef
            .doc(doc.data().uid)
            .update({ restaurantId: restaurantId, type: "chef" })
            .then(() => {
              dispatch(addChefsSuccess());
            })
            .catch(error => {
              dispatch(addChefsError(error));
            });
        });
      })
      .catch(error => {
        dispatch(addChefsError(error));
      });
  };
}

export const addChefsBegin = () => ({
  type: ADD_CHEFS_BEGIN
});

export const addChefsSuccess = () => ({
  type: ADD_CHEFS_SUCCESS
});

export const addChefsError = error => ({
  type: ADD_CHEFS_ERROR,
  payload: { error }
});

export function deleteChefs(email) {
  return dispatch => {
    dispatch(deleteChefsBegin());
    const userCollectionRef = firestore.collection(USERS);
    const waiterRef = userCollectionRef.where(EMAIL, "==", email);
    waiterRef
      .get()
      .then(snapShot => {
        snapShot.forEach(doc => {
          userCollectionRef
            .doc(doc.data().uid)
            .update({ restaurantId: "", type: "user" })
            .then(() => {
              dispatch(deleteChefsSuccess());
            })
            .catch(error => {
              dispatch(deleteChefsError(error));
            });
        });
      })
      .catch(error => {
        dispatch(deleteChefsError(error));
      });
  };
}

export const deleteChefsBegin = () => ({
  type: DELETE_CHEFS_BEGIN
});

export const deleteChefsSuccess = () => ({
  type: DELETE_CHEFS_SUCCESS
});

export const deleteChefsError = error => ({
  type: DELETE_CHEFS_ERROR,
  payload: { error }
});
