import { firestore } from "../../../../store";
import { RESTAURANTS } from "../../../../views/RestaurantPage/restaurantActions";
import orderPlacedImg from "../../../../assets/img/sidebar-icons/orderPlaced.svg";
import prepairing from "../../../../assets/img/sidebar-icons/prepairing.svg";
import prepaired from "../../../../assets/img/sidebar-icons/prepaired.svg";
import served from "../../../../assets/img/sidebar-icons/served.svg";
import happyDining from "../../../../assets/img/sidebar-icons/happyDining.svg";
import billPaid from "../../../../assets/img/sidebar-icons/billPaid.svg";
import error from "../../../../assets/img/sidebar-icons/error.svg";
import { showMessage } from "../../../../actions/messageActions";

export const FETCH_ORDERS_BEGIN = "FETCH_ORDERS_BEGIN";
export const FETCH_ORDERS_SUCCESS = "FETCH_ORDERS_SUCCESS";
export const FETCH_ACTIVE_ORDERS_BEGIN = "FETCH_ACTIVE_ORDERS_BEGIN";
export const FETCH_ACTIVE_ORDERS_SUCCESS = "FETCH_ACTIVE_ORDERS_SUCCESS";
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
export const ORDER_BEING_PREPAIRED_ACTION = "ORDER_BEING_PREPAIRED_ACTION";
export const ORDER_PREPAIRED_ACTION = "ORDER_PREPAIRED_ACTION";
export const ORDER_SERVED_ACTION = "ORDER_SERVED_ACTION";
export const PAYMENT_RECEIVED_ACTION = "PAYMENT_RECEIVED_ACTION";
export const SET_TABLE_AND_CUSTOMER = "SET_TABLE_AND_CUSTOMER";
export const UPDATE_ORDER_STATUS_BEGIN = "UPDATE_ORDER_STATUS_BEGIN";
export const UPDATE_ORDER_STATUS_SUCCESS = "UPDATE_ORDER_STATUS_SUCCESS";
export const UPDATE_ORDER_STATUS_ERROR = "UPDATE_ORDER_STATUS_ERROR";

export function getOrderRef(restaurantId) {
  return firestore
    .collection(RESTAURANTS)
    .doc(restaurantId)
    .collection(ORDERS);
}
export const TAKE_AWAY = "Take Away";
export const ORDER_CANCELLED = -1;
export const RESET_ORDER = 0;
export const PLACING_ORDER = 1;
export const ORDER_PLACED = 2;
export const PREPAIRING_ORDER = 3;
export const STATUS = "status";
export const ORDER_PREPAIRED = 4;
export const ORDER_SERVED = 5;
export const DINING = 6;
export const PAYMENT_RECEIVED = 7;

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

export function fetchActiveOrders(restaurantId) {
  return dispatch => {
    dispatch(fetchActiveOrdersBegin());
    if (restaurantId) {
      const ordersRef = getOrderRef(restaurantId);
      const query = ordersRef
        .where(STATUS, "<", PAYMENT_RECEIVED)
        .where(STATUS, ">=", ORDER_PLACED);
      query.onSnapshot(querySnapshot => {
        const orders = [];
        querySnapshot.forEach(doc => {
          orders.push(doc.data());
        });
        dispatch(fetchActiveOrdersSuccess(orders));
      });
    }
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
        console.log("Failed to place order..", error);
        dispatch(showMessage("Failed to place order.."));
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

export const orderBeingPrepaired = () => ({
  type: ORDER_BEING_PREPAIRED_ACTION
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

export const fetchActiveOrdersBegin = () => ({
  type: FETCH_ACTIVE_ORDERS_BEGIN
});

export const clearCurrentOrders = () => ({
  type: CLEAR_CURRENT_ORDERS
});

export const fetchOrdersSuccess = orders => ({
  type: FETCH_ORDERS_SUCCESS,
  payload: { orders }
});

export const fetchActiveOrdersSuccess = activeOrders => ({
  type: FETCH_ACTIVE_ORDERS_SUCCESS,
  payload: { activeOrders }
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

export const setTableAndUser = tableAndUserInfo => ({
  type: SET_TABLE_AND_CUSTOMER,
  payload: {
    ...tableAndUserInfo
  }
});

export const nextStatus = (restaurantId, order) => {
  order.status = ++order.status;
  if (order.status > PAYMENT_RECEIVED) {
    order.status = PAYMENT_RECEIVED;
  }
  return updateStatus(restaurantId, order);
};

export const prevStatus = (restaurantId, order) => {
  order.status = --order.status;
  if (order.status < ORDER_PLACED) {
    order.status = ORDER_PLACED;
  }
  return updateStatus(restaurantId, order);
};

export const cancelStatus = (restaurantId, order) => {
  order.status = -1;
  return updateStatus(restaurantId, order);
};

export const updateStatusBegin = () => ({
  type: UPDATE_ORDER_STATUS_BEGIN
});

export const updateStatusSuccess = order => ({
  type: UPDATE_ORDER_STATUS_SUCCESS,
  payload: order
});

export const updateStatusError = () => ({
  type: UPDATE_ORDER_STATUS_ERROR
});

export function updateStatus(restaurantId, order) {
  return dispatch => {
    dispatch(updateStatusBegin());
    const orderRef = firestore
      .collection(RESTAURANTS)
      .doc(restaurantId)
      .collection(ORDERS)
      .doc(order.id);
    orderRef
      .set(order)
      .then(() => {
        dispatch(updateStatusSuccess(order));
      })
      .catch(error => {
        console.log("Failed to update order status..", error);
        dispatch(showMessage("Failed to update order status.."));
      });
  };
}

export const getStatus = item => {
  let icon = "";
  let text = "";

  switch (item.status) {
    case ORDER_PLACED:
      icon = orderPlacedImg;
      text = "Order placed";
      break;
    case PREPAIRING_ORDER:
      icon = prepairing;
      text = "Food is being prepaired";
      break;
    case ORDER_PREPAIRED:
      icon = prepaired;
      text = "Ready to serve";
      break;
    case ORDER_SERVED:
      icon = served;
      text = "Food served";
      break;
    case DINING:
      icon = happyDining;
      text = "Dining";
      break;
    case PAYMENT_RECEIVED:
      icon = billPaid;
      text = "Bill paid";
      break;
    default:
      icon = error;
      text = "Order Cancelled";
      break;
  }
  return { icon, text };
};
