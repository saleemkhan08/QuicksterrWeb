import { firestore, database } from "../store";
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
    const query = database
      .ref()
      .child(USERS)
      .orderByChild(RESTAURANT_ID)
      .equalTo(restaurantId);
    query.on("value", querySnapshot => {
      const restaurantEmployees = querySnapshot.val();
      const chefs = [];
      const uids = Object.keys(restaurantEmployees);
      uids.forEach(uid => {
        const employee = restaurantEmployees[uid];
        if (employee.type === CHEFS) {
          chefs.push(employee);
        }
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
    const userRef = database.ref(USERS);
    dispatch(addChefsBegin());
    userRef
      .orderByChild(EMAIL)
      .equalTo(email)
      .once("value")
      .then(snapShot => {
        const users = snapShot.val();
        const user = users[Object.keys(users)[0]];
        return userRef
          .child(user.uid)
          .update({ restaurantId: restaurantId, type: "chef" });
      })
      .then(() => {
        dispatch(addChefsSuccess());
      })
      .catch(error => {
        console.log("addChefs : error ", error);
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
    const userRef = database.ref(USERS);
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
        dispatch(deleteChefsSuccess());
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
