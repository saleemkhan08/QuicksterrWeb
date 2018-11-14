import chefs from "../assets/img/sidebar-icons/chefs.svg";
import orders from "../assets/img/sidebar-icons/orders.svg";
import tables from "../assets/img/sidebar-icons/tables.svg";
import waiters from "../assets/img/sidebar-icons/waiters.svg";
import notifications from "../assets/img/sidebar-icons/notifications.svg";
import category from "../assets/img/sidebar-icons/category.svg";
import menu from "../assets/img/sidebar-icons/menu.svg";
import dish from "../assets/img/sidebar-icons/dishes.svg";
import { firestore } from "../store";
export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const CHANGE_NAVBAR_COLOR = "CHANGE_NAVBAR_COLOR";
export const FETCH_USER = "FETCH_USER";
export const USERS = "users";
export const RESTAURANT_ID = "restaurantId";
export const TYPE = "type";
export const CHANGE_MAIN_CONTENT_TYPE = "CHANGE_MAIN_CONTENT_TYPE";
export const SET_ADMIN_STATUS = "SET_ADMIN_STATUS";

export const RESTAURANT_DETAILS = {
  name: "Restaurants",
  type: "RESTAURANT_DETAILS",
  icon: tables,
  emptyListMsg: "No restaurants found!",
  restrictionMsg:
    "You cannot delete this restaurant! Please contact Queue Breaker Admin.",
  deleteConfirmMsgStart: 'Are you sure you want to delete "',
  deleteConfirmMsgEnd: '"?'
};

export const MENU_DETAILS = {
  name: "Menu",
  icon: menu,
  type: "MENU_DETAILS",
  emptyListMsg: "No menu found!",
  cautionMsg:
    "This will delete all the related menu items under this category!",
  deleteConfirmMsgStart: 'Are you sure you want to delete "',
  deleteConfirmMsgEnd: '" menu category?'
};

export const MENU_ITEM_DETAILS = {
  name: "Menu Items",
  icon: dish,
  type: "MENU_ITEM_DETAILS",
  emptyListMsg: "No menu itmes found!",
  deleteConfirmMsgStart: 'Are you sure you want to delete "',
  deleteConfirmMsgEnd: '" menu item?'
};

export const ORDER_DETAILS = {
  name: "Orders",
  type: "ORDER_DETAILS",
  icon: orders,
  emptyListMsg: "No orders found!",
  deleteConfirmMsgStart: 'Are you sure you want to delete "',
  deleteConfirmMsgEnd: '" order?'
};

export const TABLE_DETAILS = {
  name: "Tables",
  type: "TABLE_DETAILS",
  icon: tables,
  emptyListMsg: "No tables found!",
  deleteConfirmMsgStart: 'Are you sure you want to delete "',
  deleteConfirmMsgEnd: '"?'
};

export const CHEF_DETAILS = {
  name: "Chefs",
  type: "CHEF_DETAILS",
  icon: chefs,
  emptyListMsg: "No chefs found!",
  deleteConfirmMsgStart: 'Are you sure you want to remove "',
  deleteConfirmMsgEnd: "\" from chef's position?"
};

export const WAITER_DETAILS = {
  name: "Waiters",
  icon: waiters,
  type: "WAITER_DETAILS",
  emptyListMsg: "No waiters found!",
  deleteConfirmMsgStart: 'Are you sure you want to remove "',
  deleteConfirmMsgEnd: "\" from waiter's position?"
};

export const CATEGORY_DETAILS = {
  name: "Category",
  type: "CATEGORY_DETAILS",
  icon: category,
  emptyListMsg: "No items found in category!",
  deleteConfirmMsgStart: 'Are you sure you want to delete "',
  deleteConfirmMsgEnd: '" from category?'
};

export const NOTIFICATION_DETAILS = {
  name: "Notifications",
  type: "NOTIFICATION_DETAILS",
  icon: notifications,
  emptyListMsg: "You have no notifications!"
};

export const IMAGES_DETAILS = {
  emptyListMsg: "No Images found!",
  deleteConfirmMsgStart: "Are you sure you want to delete this image?",
  type: "IMAGES_DETAILS"
};

export const RESTAURANT_ADMIN = "restaurantAdmin";
export const MASTER_ADMIN = "masterAdmin";
export const WAITER = "waiter";
export const CHEF = "chef";
export const USER = "user";

export const sidebarLinks = [
  MENU_DETAILS,
  CATEGORY_DETAILS,
  ORDER_DETAILS,
  TABLE_DETAILS,
  CHEF_DETAILS,
  WAITER_DETAILS,
  NOTIFICATION_DETAILS
];

export function fetchUser(userId) {
  return dispatch => {
    const usersRef = firestore.collection(USERS).doc(userId);
    usersRef
      .get()
      .then(docSnapshot => {
        const user = docSnapshot.data();
        dispatch(loginUser(user));
        return user;
      })
      .catch(() => dispatch(logoutUser()));
  };
}

export const loginUser = user => ({
  type: LOGIN_USER,
  payload: user
});

export const changeMainContentType = name => ({
  type: CHANGE_MAIN_CONTENT_TYPE,
  payload: name ? name : MENU_DETAILS.name
});

export const changeNavbarColor = color => ({
  type: CHANGE_NAVBAR_COLOR,
  payload: color
});

export const logoutUser = () => ({
  type: LOGOUT_USER
});

export const setAdminStatus = status => ({
  type: SET_ADMIN_STATUS,
  payload: status
});
