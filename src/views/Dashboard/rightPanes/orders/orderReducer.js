import {
  FETCH_ORDERS_BEGIN,
  FETCH_ORDERS_SUCCESS,
  FETCH_ACTIVE_ORDERS_BEGIN,
  FETCH_ACTIVE_ORDERS_SUCCESS,
  ADD_ITEM_TO_ORDER,
  REMOVE_ITEM_FROM_ORDER,
  SET_CURRENT_ORDER_RESTAURANT_ID,
  CLEAR_CURRENT_ORDERS,
  RESET_ORDER_ACTION,
  PLACING_ORDER_ACTION,
  ORDER_PLACED_ACTION,
  ORDER_BEING_PREPAIRED_ACTION,
  ORDER_PREPAIRED_ACTION,
  ORDER_SERVED_ACTION,
  PAYMENT_RECEIVED_ACTION,
  RESET_ORDER,
  PLACING_ORDER,
  ORDER_PLACED,
  PREPAIRING_ORDER,
  ORDER_PREPAIRED,
  ORDER_SERVED,
  PAYMENT_RECEIVED,
  OPEN_TABLE_AND_USER_SETTER,
  CLOSE_TABLE_AND_USER_SETTER,
  SET_TABLE_AND_CUSTOMER,
  TAKE_AWAY,
  UPDATE_ORDER_STATUS_BEGIN,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_ERROR,
  OPEN_VARIANT_ORDER_DIALOG,
  CLOSE_VARIANT_ORDER_DIALOG,
  OPEN_ORDER_DETAIL_DIALOG,
  CLOSE_ORDER_DETAIL_DIALOG,
  FETCH_ORDERS_TO_BE_PREPARED_BEGIN,
  FETCH_ORDERS_TO_BE_PREPARED_SUCCESS
} from "./ordersActions";

// RESET_ORDER -> PLACING_ORDER -> ORDER_PLACED -> PREPAIRING_ORDER -> ORDER_PREPAIRED -> ORDER_SERVED;
/* RESET_ORDER -> PLACING_ORDER -> ORDER_PLACED -> PREPAIRING_ORDER ->
   UPDATE_ORDER -> ORDER_UPDATED -> PREPAIRING_UPDATED_ORDER -> ORDER_PREPAIRED -> ORDER_SERVED; */

//Once the status changes to PREPAIRING_ORDER user cannot delete any orders but they can add more items to the order;

const initialState = {
  orders: [],
  activeOrders: [],
  ordersToBePrepared: [],
  isLoading: true,
  isActiveLoading: true,
  isOrdersToBePreparedLoading: true,
  isStatusLoading: false,
  error: null,
  currentOrderList: {},
  currentOrderRestaurant: undefined,
  status: RESET_ORDER,
  openTableAndUserSetter: false,
  table: undefined,
  noOfPeople: 1,
  name: "",
  phoneNo: "",
  currentDish: undefined,
  openVariantOrderDialog: false,
  openOrderDetailDialog: false,
  selectedOrder: undefined
};

const OrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERS_TO_BE_PREPARED_BEGIN:
      return {
        ...state,
        isOrdersToBePreparedLoading: true
      };
    case FETCH_ORDERS_TO_BE_PREPARED_SUCCESS:
      return {
        ...state,
        isOrdersToBePreparedLoading: false,
        ordersToBePrepared: action.payload
      };
    case OPEN_ORDER_DETAIL_DIALOG:
      return {
        ...state,
        openOrderDetailDialog: true,
        selectedOrder: action.payload
      };
    case CLOSE_ORDER_DETAIL_DIALOG:
      return {
        ...state,
        openOrderDetailDialog: false,
        selectedOrder: undefined
      };
    case OPEN_VARIANT_ORDER_DIALOG:
      return {
        ...state,
        openVariantOrderDialog: true,
        currentDish: action.payload
      };
    case CLOSE_VARIANT_ORDER_DIALOG:
      return {
        ...state,
        openVariantOrderDialog: false,
        currentDish: undefined
      };
    case UPDATE_ORDER_STATUS_BEGIN:
      return {
        ...state,
        isStatusLoading: true
      };
    case UPDATE_ORDER_STATUS_SUCCESS: {
      const updatedActiveOrders = [];
      state.activeOrders.forEach(order => {
        if (order.id === action.payload.id) {
          updatedActiveOrders.push(action.payload);
        } else {
          updatedActiveOrders.push(order);
        }
      });
      return {
        ...state,
        isStatusLoading: false,
        activeOrders: updatedActiveOrders
      };
    }
    case UPDATE_ORDER_STATUS_ERROR:
      return {
        ...state,
        isStatusLoading: false
      };
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
        currentOrderList: {},
        error: null,
        table: undefined,
        name: "",
        phoneNo: ""
      };
    case ORDER_BEING_PREPAIRED_ACTION:
      return {
        ...state,
        status: PREPAIRING_ORDER
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
    case FETCH_ACTIVE_ORDERS_BEGIN:
      return {
        ...state,
        isActvieLoading: true,
        error: null
      };

    case FETCH_ACTIVE_ORDERS_SUCCESS:
      return {
        ...state,
        isActvieLoading: false,
        activeOrders: action.payload.activeOrders
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
      if (Object.keys(state.currentOrderList).length > 0) {
        return {
          ...state,
          currentOrderList: state.currentOrderList
        };
      } else {
        return {
          ...state,
          error: null,
          table: undefined,
          name: "",
          phoneNo: ""
        };
      }
    }
    case SET_CURRENT_ORDER_RESTAURANT_ID:
      return {
        ...state,
        currentOrderRestaurant: action.payload
      };
    case CLEAR_CURRENT_ORDERS:
      return {
        ...state,
        error: null,
        table: undefined,
        currentOrderList: {},
        name: "",
        phoneNo: ""
      };
    case OPEN_TABLE_AND_USER_SETTER: {
      return {
        ...state,
        openTableAndUserSetter: true
      };
    }
    case CLOSE_TABLE_AND_USER_SETTER:
      return {
        ...state,
        openTableAndUserSetter: false
      };
    case SET_TABLE_AND_CUSTOMER:
      return {
        ...state,
        table: action.payload.isTakeAway
          ? TAKE_AWAY
          : action.payload.table
          ? action.payload.table
          : TAKE_AWAY,
        noOfPeople: action.payload.noOfPeople,
        name: action.payload.name,
        phoneNo: action.payload.phoneNo
      };
    default:
      return state;
  }
};

export default OrderReducer;
