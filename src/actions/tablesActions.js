import { firestore } from "../store";
import { RESTAURANTS } from "../views/RestaurantPage/restaurantActions";
export const TABLES = "tables";

export const ADD_TABLES = "ADD_TABLES";
export const ADD_TABLES_BEGIN = "ADD_TABLES_BEGIN";
export const ADD_TABLES_SUCCESS = "ADD_TABLES_SUCCESS";
export const ADD_TABLES_ERROR = "ADD_TABLES_ERROR";

export const EDIT_TABLES = "EDIT_TABLES";
export const EDIT_TABLES_BEGIN = "ADD_TABLES_BEGIN";
export const EDIT_TABLES_SUCCESS = "ADD_TABLES_SUCCESS";
export const EDIT_TABLES_ERROR = "EDIT_TABLES_ERROR";

export const FETCH_TABLES = "FETCH_TABLES";
export const FETCH_TABLES_BEGIN = "FETCH_TABLES_BEGIN";
export const FETCH_TABLES_SUCCESS = "FETCH_TABLES_SUCCESS";
export const FETCH_TABLES_ERROR = "FETCH_TABLES_ERROR";

export const DELETE_TABLES = "DELETE_TABLES";
export const DELETE_TABLES_BEGIN = "DELETE_TABLES_BEGIN";
export const DELETE_TABLES_SUCCESS = "DELETE_TABLES_SUCCESS";
export const DELETE_TABLES_ERROR = "DELETE_TABLES_ERROR";

export function fetchTables(restaurantId) {
  return dispatch => {
    dispatch(fetchTablesBegin());
    const tablesRef = firestore
      .collection(RESTAURANTS)
      .doc(restaurantId)
      .collection(TABLES)
      .orderBy("name");
    tablesRef.onSnapshot(querySnapshot => {
      const tables = [];
      querySnapshot.forEach(doc => {
        tables.push(doc.data());
      });
      dispatch(fetchTablesSuccess(tables));
    });
  };
}

export const fetchTablesBegin = () => ({
  type: FETCH_TABLES_BEGIN
});

export const fetchTablesSuccess = tables => ({
  type: FETCH_TABLES_SUCCESS,
  payload: tables
});

export const fetchTablesError = error => ({
  type: FETCH_TABLES_ERROR,
  payload: { error }
});

export function addTables(restaurantId, table) {
  return dispatch => {
    dispatch(addTablesBegin());
    const newTableRef = firestore
      .collection(RESTAURANTS)
      .doc(restaurantId)
      .collection(TABLES)
      .doc();
    table.id = newTableRef.id;
    newTableRef
      .set(table)
      .then(() => {
        dispatch(addTablesSuccess());
      })
      .catch(error => {
        dispatch(addTablesError(error));
      });
  };
}

export const addTablesBegin = () => ({
  type: ADD_TABLES_BEGIN
});

export const addTablesSuccess = () => ({
  type: ADD_TABLES_SUCCESS
});

export const addTablesError = error => ({
  type: ADD_TABLES_ERROR,
  payload: { error }
});

export function editTables(restaurantId, table) {
  return dispatch => {
    dispatch(editTablesBegin());
    const tableRef = firestore
      .collection(RESTAURANTS)
      .doc(restaurantId)
      .collection(TABLES)
      .doc(table.id);
    tableRef
      .set(table)
      .then(() => {
        dispatch(editTablesSuccess());
      })
      .catch(error => {
        dispatch(editTablesError(error));
      });
  };
}

export const editTablesBegin = () => ({
  type: EDIT_TABLES_BEGIN
});

export const editTablesSuccess = () => ({
  type: EDIT_TABLES_SUCCESS
});

export const editTablesError = error => ({
  type: EDIT_TABLES_ERROR,
  payload: { error }
});

export function deleteTables(restaurantId, table) {
  return dispatch => {
    dispatch(deleteTablesBegin());
    const tableRef = firestore
      .collection(RESTAURANTS)
      .doc(restaurantId)
      .collection(TABLES)
      .doc(table.id);
    tableRef
      .delete()
      .then(() => {
        dispatch(deleteTablesSuccess());
      })
      .catch(error => {
        dispatch(deleteTablesError(error));
      });
  };
}

export const deleteTablesBegin = () => ({
  type: DELETE_TABLES_BEGIN
});

export const deleteTablesSuccess = () => ({
  type: DELETE_TABLES_SUCCESS
});

export const deleteTablesError = error => ({
  type: DELETE_TABLES_ERROR,
  payload: { error }
});
