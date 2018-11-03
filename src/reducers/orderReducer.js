import {
  FETCH_ORDERS_BEGIN,
  FETCH_ORDERS_SUCCESS,
  ADD_ITEM_TO_ORDER,
  REMOVE_ITEM_FROM_ORDER,
  SET_CURRENT_ORDER_RESTAURANT_ID,
  CLEAR_CURRENT_ORDERS,
  RESET_ORDER_ACTION,
  PLACING_ORDER_ACTION,
  ORDER_PLACED_ACTION,
  FAILED_TO_PLACE_ORDER_ACTION,
  ORDER_BEING_PREPAIRED_ACTION,
  UPDATING_ORDER_ACTION,
  FAILED_TO_UPDATE_ORDER_ACTION,
  ORDER_UPDATED_ACTION,
  PREPAIRING_UPDATED_ORDER_ACTION,
  ORDER_PREPAIRED_ACTION,
  ORDER_SERVED_ACTION,
  PAYMENT_RECEIVED_ACTION,
  RESET_ORDER,
  PLACING_ORDER,
  ORDER_PLACED,
  FAILED_TO_PLACE_ORDER,
  PREPAIRING_ORDER,
  UPDATING_ORDER,
  FAILED_TO_UPDATE_ORDER,
  ORDER_UPDATED,
  PREPAIRING_UPDATED_ORDER,
  ORDER_PREPAIRED,
  ORDER_SERVED,
  PAYMENT_RECEIVED,
  OPEN_TABLE_AND_USER_SETTER,
  CLOSE_TABLE_AND_USER_SETTER,
  SET_TABLE_AND_CUSTOMER
} from "../actions/ordersActions";

// RESET_ORDER -> PLACING_ORDER -> ORDER_PLACED -> PREPAIRING_ORDER -> ORDER_PREPAIRED -> ORDER_SERVED;
/* RESET_ORDER -> PLACING_ORDER -> ORDER_PLACED -> PREPAIRING_ORDER ->
   UPDATE_ORDER -> ORDER_UPDATED -> PREPAIRING_UPDATED_ORDER -> ORDER_PREPAIRED -> ORDER_SERVED; */

//Once the status changes to PREPAIRING_ORDER user cannot delete any orders but they can add more items to the order;

const initialState = {
  orders: [],
  isLoading: true,
  error: null,
  currentOrderList: {},
  currentOrderRestaurant: undefined,
  status: RESET_ORDER,
  openTableAndUserSetter: false,
  table: undefined,
  customer: undefined,
  noOfPeople: 1
};

const OrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_ORDER_ACTION:
      return {
        ...state,
        status: RESET_ORDER
      };
    case PLACING_ORDER_ACTION:
      return {
        ...state,
        status: PLACING_ORDER
      };
    case ORDER_PLACED_ACTION:
      return {
        ...state,
        status: ORDER_PLACED,
        table: undefined,
        customer: undefined
      };
    case FAILED_TO_PLACE_ORDER_ACTION:
      return {
        ...state,
        status: FAILED_TO_PLACE_ORDER
      };
    case ORDER_BEING_PREPAIRED_ACTION:
      return {
        ...state,
        status: PREPAIRING_ORDER
      };
    case UPDATING_ORDER_ACTION:
      return {
        ...state,
        status: UPDATING_ORDER
      };

    case FAILED_TO_UPDATE_ORDER_ACTION:
      return {
        ...state,
        status: FAILED_TO_UPDATE_ORDER
      };
    case ORDER_UPDATED_ACTION:
      return {
        ...state,
        status: ORDER_UPDATED
      };
    case PREPAIRING_UPDATED_ORDER_ACTION:
      return {
        ...state,
        status: PREPAIRING_UPDATED_ORDER
      };

    case ORDER_PREPAIRED_ACTION:
      return {
        ...state,
        status: ORDER_PREPAIRED
      };
    case ORDER_SERVED_ACTION:
      return {
        ...state,
        status: ORDER_SERVED
      };
    case PAYMENT_RECEIVED_ACTION:
      return {
        ...state,
        status: PAYMENT_RECEIVED
      };
    case FETCH_ORDERS_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        orders: action.payload.orders
      };
    case ADD_ITEM_TO_ORDER: {
      const item = action.payload.item;
      item.count++;
      state.currentOrderList[item.id] = item;
      return {
        ...state,
        currentOrderList: state.currentOrderList
      };
    }
    case REMOVE_ITEM_FROM_ORDER: {
      const item = action.payload.item;
      item.count--;
      if (item.count <= 0) {
        delete state.currentOrderList[item.id];
      }
      return {
        ...state,
        currentOrderList: state.currentOrderList
      };
    }
    case SET_CURRENT_ORDER_RESTAURANT_ID:
      return {
        ...state,
        currentOrderRestaurant: action.payload
      };
    case CLEAR_CURRENT_ORDERS:
      return {
        ...state,
        currentOrderRestaurant: undefined,
        currentOrderList: {}
      };
    case OPEN_TABLE_AND_USER_SETTER:
      return {
        ...state,
        openTableAndUserSetter: true
      };
    case CLOSE_TABLE_AND_USER_SETTER:
      return {
        ...state,
        openTableAndUserSetter: false
      };
    case SET_TABLE_AND_CUSTOMER:
      return {
        ...state,
        table: action.payload.table,
        customer: action.payload.customer,
        noOfPeople: action.payload.noOfPeople
      };
    default:
      return state;
  }
};

export default OrderReducer;
