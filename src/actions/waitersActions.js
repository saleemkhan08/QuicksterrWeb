import { firestore } from "../store";
import { USERS, RESTAURANT_ID, TYPE } from "./navigationActions";
export const WAITERS = "waiter";

export const ADD_WAITERS = "ADD_WAITERS";
export const ADD_WAITERS_BEGIN = "ADD_WAITERS_BEGIN";
export const ADD_WAITERS_SUCCESS = "ADD_WAITERS_SUCCESS";
export const ADD_WAITERS_ERROR = "ADD_WAITERS_ERROR";

export const FETCH_WAITERS = "FETCH_WAITERS";
export const FETCH_WAITERS_BEGIN = "FETCH_WAITERS_BEGIN";
export const FETCH_WAITERS_SUCCESS = "FETCH_WAITERS_SUCCESS";
export const FETCH_WAITERS_ERROR = "FETCH_WAITERS_ERROR";

export const DELETE_WAITERS = "DELETE_WAITERS";
export const DELETE_WAITERS_BEGIN = "DELETE_WAITERS_BEGIN";
export const DELETE_WAITERS_SUCCESS = "DELETE_WAITERS_SUCCESS";
export const DELETE_WAITERS_ERROR = "DELETE_WAITERS_ERROR";

export const EMAIL = "email";

export function fetchWaiters(restaurantId) {
  return dispatch => {
    dispatch(fetchWaitersBegin());
    const waitersRef = firestore.collection(USERS);
    const query = waitersRef
      .where(RESTAURANT_ID, "==", restaurantId)
      .where(TYPE, "==", WAITERS);
    query.onSnapshot(querySnapshot => {
      const waiters = [];
      querySnapshot.forEach(doc => {
        waiters.push(doc.data());
      });
      dispatch(fetchWaitersSuccess(waiters));
    });
  };
}

export const fetchWaitersBegin = () => ({
  type: FETCH_WAITERS_BEGIN
});

export const fetchWaitersSuccess = waiters => ({
  type: FETCH_WAITERS_SUCCESS,
  payload: waiters
});

export const fetchWaitersError = error => ({
  type: FETCH_WAITERS_ERROR,
  payload: { error }
});

export function addWaiters(restaurantId, email) {
  return dispatch => {
    dispatch(addWaitersBegin());
    const userCollectionRef = firestore.collection(USERS);
    const waiterRef = userCollectionRef.where(EMAIL, "==", email);
    waiterRef
      .get()
      .then(snapShot => {
        snapShot.forEach(doc => {
          userCollectionRef
            .doc(doc.data().uid)
            .update({ restaurantId: restaurantId, type: "waiter" })
            .then(() => {
              dispatch(addWaitersSuccess());
            })
            .catch(error => {
              dispatch(addWaitersError(error));
            });
        });
      })
      .catch(error => {
        dispatch(addWaitersError(error));
      });
  };
}

export const addWaitersBegin = () => ({
  type: ADD_WAITERS_BEGIN
});

export const addWaitersSuccess = () => ({
  type: ADD_WAITERS_SUCCESS
});

export const addWaitersError = error => ({
  type: ADD_WAITERS_ERROR,
  payload: { error }
});

export function deleteWaiters(email) {
  return dispatch => {
    dispatch(deleteWaitersBegin());
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
              dispatch(deleteWaitersSuccess());
            })
            .catch(error => {
              dispatch(deleteWaitersError(error));
            });
        });
      })
      .catch(error => {
        dispatch(deleteWaitersError(error));
      });
  };
}

export const deleteWaitersBegin = () => ({
  type: DELETE_WAITERS_BEGIN
});

export const deleteWaitersSuccess = () => ({
  type: DELETE_WAITERS_SUCCESS
});

export const deleteWaitersError = error => ({
  type: DELETE_WAITERS_ERROR,
  payload: { error }
});
