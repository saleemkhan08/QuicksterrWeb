import { firestore, database } from "../store";
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
    const query = database
      .ref()
      .child(USERS)
      .orderByChild(RESTAURANT_ID)
      .equalTo(restaurantId);
    query.on("value", querySnapshot => {
      const restaurantEmployees = querySnapshot.val();
      const waiters = [];
      const uids = Object.keys(restaurantEmployees);
      uids.forEach(uid => {
        const employee = restaurantEmployees[uid];
        if (employee.type === WAITERS) {
          waiters.push(employee);
        }
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
    const userRef = database.ref(USERS);
    dispatch(addWaitersBegin());
    userRef
      .orderByChild(EMAIL)
      .equalTo(email)
      .once("value")
      .then(snapShot => {
        const users = snapShot.val();
        const user = users[Object.keys(users)[0]];
        return userRef
          .child(user.uid)
          .update({ restaurantId: restaurantId, type: "waiter" });
      })
      .then(() => {
        dispatch(addWaitersSuccess());
      })
      .catch(error => {
        console.log("addWaiters : error ", error);
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
    const userRef = database.ref(USERS);
    dispatch(deleteWaitersBegin());
    userRef
      .orderByChild(EMAIL)
      .equalTo(email)
      .once("value")
      .then(snapShot => {
        const users = snapShot.val();
        const user = users[Object.keys(users)[0]];
        return userRef
          .child(user.uid)
          .update({ restaurantId: "", type: "user" });
      })
      .then(() => {
        dispatch(deleteWaitersSuccess());
      })
      .catch(error => {
        console.log("addWaiters : error ", error);
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
