import { firestore } from "../store";
import { RESTAURANTS } from "./restaurantActions";
export const FETCH_ORDERS_BEGIN = "FETCH_ORDERS_BEGIN";
export const FETCH_ORDERS_SUCCESS = "FETCH_ORDERS_SUCCESS";
export const ADD_ITEM_TO_ORDER = "ADD_ITEM_TO_ORDER";
export const REMOVE_ITEM_FROM_ORDER = "REMOVE_ITEM_FROM_ORDER";
export const SET_CURRENT_ORDER_RESTAURANT_ID =
  "SET_CURRENT_ORDER_RESTAURANT_ID";
export const CLEAR_CURRENT_ORDERS = "CLEAR_CURRENT_ORDERS";
export const ORDERS = "orders";
export const DATE = "date";
export const OPEN_TABLE_AND_USER_SETTER = "OPEN_TABLE_AND_USER_SETTER";
export const CLOSE_TABLE_AND_USER_SETTER = "CLOSE_TABLE_AND_USER_SETTER";
export const RESET_ORDER_ACTION = "RESET_ORDER_ACTION";
export const PLACING_ORDER_ACTION = "PLACING_ORDER_ACTION";
export const ORDER_PLACED_ACTION = "ORDER_PLACED_ACTION";
export const FAILED_TO_PLACE_ORDER_ACTION = "FAILED_TO_PLACE_ORDER_ACTION";
export const ORDER_BEING_PREPAIRED_ACTION = "ORDER_BEING_PREPAIRED_ACTION";
export const UPDATING_ORDER_ACTION = "UPDATE_ORDER_ACTION";
export const FAILED_TO_UPDATE_ORDER_ACTION = "FAILED_TO_UPDATE_ORDER_ACTION";
export const ORDER_UPDATED_ACTION = "ORDER_UPDATED_ACTION";
export const PREPAIRING_UPDATED_ORDER_ACTION =
  "PREPAIRING_UPDATED_ORDER_ACTION";
export const ORDER_PREPAIRED_ACTION = "ORDER_PREPAIRED_ACTION";
export const ORDER_SERVED_ACTION = "ORDER_SERVED_ACTION";
export const PAYMENT_RECEIVED_ACTION = "PAYMENT_RECEIVED_ACTION";
export const SET_TABLE_AND_CUSTOMER = "SET_TABLE_AND_CUSTOMER";
export function getOrderRef(restaurantId) {
  return firestore
    .collection(RESTAURANTS)
    .doc(restaurantId)
    .collection(ORDERS);
}

export const FAILED_TO_UPDATE_ORDER = -2;
export const FAILED_TO_PLACE_ORDER = -1;
export const RESET_ORDER = 0;
export const PLACING_ORDER = 1;
export const ORDER_PLACED = 2;
export const PREPAIRING_ORDER = 3;
export const UPDATING_ORDER = 4;
export const ORDER_UPDATED = 5;

export const PREPAIRING_UPDATED_ORDER = 6;
export const ORDER_PREPAIRED = 7;

export const ORDER_SERVED = 8;
export const DINING = 9;
export const PAYMENT_RECEIVED = 10;

export function fetchOrders(restaurantId, dateKey) {
  return dispatch => {
    dispatch(fetchOrdersBegin());
    const ordersRef = getOrderRef(restaurantId);
    const query = ordersRef.where(
      DATE,
      "==",
      dateKey ? dateKey : getCurrentDate()
    );
    query.onSnapshot(querySnapshot => {
      const orders = [];
      querySnapshot.forEach(doc => {
        orders.push(doc.data());
      });
      dispatch(fetchOrdersSuccess(orders));
    });
  };
}

export function get2DigitNumber(num) {
  return num < 10 ? "0" + num : num;
}

export function getCurrentDate() {
  let currentdate = new Date();
  const date = get2DigitNumber(currentdate.getDate());
  const month = get2DigitNumber(currentdate.getMonth() + 1);
  return currentdate.getFullYear() + "" + month + "" + date;
}

export function getCurrentDateTime() {
  let currentdate = new Date();
  let hours = currentdate.getHours();
  let amOrPm = hours > 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = get2DigitNumber(hours);
  const date = get2DigitNumber(currentdate.getDate());
  const month = get2DigitNumber(currentdate.getMonth() + 1);
  const mins = get2DigitNumber(currentdate.getMinutes());
  return (
    date +
    "/" +
    month +
    "/" +
    currentdate.getFullYear() +
    " " +
    hours +
    ":" +
    mins +
    " " +
    amOrPm
  );
}

export function placeOrder(restaurantId, currentOrder) {
  return dispatch => {
    dispatch(placingOrder());
    const orderRef = getOrderRef(restaurantId).doc();
    currentOrder.id = orderRef.id;
    currentOrder.timeStamp = getCurrentDateTime();
    currentOrder.date = getCurrentDate();
    currentOrder.status = ORDER_PLACED;
    orderRef
      .set(currentOrder)
      .then(() => {
        dispatch(orderPlaced());
        dispatch(clearCurrentOrders());
      })
      .catch(error => {
        dispatch(failedToPlaceOrder(error));
      });
  };
}

export const openTableAndUserSetter = () => ({
  type: OPEN_TABLE_AND_USER_SETTER
});

export const closeTableAndUserSetter = () => ({
  type: CLOSE_TABLE_AND_USER_SETTER
});

export const resetOrder = () => ({
  type: RESET_ORDER_ACTION
});

export const placingOrder = () => ({
  type: PLACING_ORDER_ACTION
});

export const orderPlaced = () => ({
  type: ORDER_PLACED_ACTION
});

export const failedToPlaceOrder = () => ({
  type: FAILED_TO_PLACE_ORDER_ACTION
});

export const orderBeingPrepaired = () => ({
  type: ORDER_BEING_PREPAIRED_ACTION
});
export const updatingOrder = () => ({
  type: UPDATING_ORDER_ACTION
});

export const failedToUpdateOrder = () => ({
  type: FAILED_TO_UPDATE_ORDER_ACTION
});
export const orderUpdated = () => ({
  type: ORDER_UPDATED_ACTION
});

export const prepairingUpatedOrder = () => ({
  type: PREPAIRING_UPDATED_ORDER_ACTION
});

export const orderPrepaired = () => ({
  type: ORDER_PREPAIRED_ACTION
});

export const orderServed = () => ({
  type: ORDER_SERVED_ACTION
});

export const paymentReceived = () => ({
  type: PAYMENT_RECEIVED_ACTION
});

export const fetchOrdersBegin = () => ({
  type: FETCH_ORDERS_BEGIN
});
export const clearCurrentOrders = () => ({
  type: CLEAR_CURRENT_ORDERS
});

export const fetchOrdersSuccess = orders => ({
  type: FETCH_ORDERS_SUCCESS,
  payload: { orders }
});

export const addItemToOrder = item => ({
  type: ADD_ITEM_TO_ORDER,
  payload: { item }
});

export const removeItemFromOrder = item => ({
  type: REMOVE_ITEM_FROM_ORDER,
  payload: { item }
});

export const setCurrentOrderRestaurant = restaurantId => ({
  type: SET_CURRENT_ORDER_RESTAURANT_ID,
  payload: restaurantId
});

export const setTableAndUser = (table, customer, noOfPeople) => ({
  type: SET_TABLE_AND_CUSTOMER,
  payload: {
    table,
    customer,
    noOfPeople
  }
});
