import { createStore, applyMiddleware, combineReducers } from "redux";
import RestaurantReducer from "./reducers/restaurantReducer";
import AuthReducer from "./reducers/authReducer";
import OrderReducer from "./reducers/orderReducer";
import TablesReducer from "./reducers/tablesReducer";
import WaitersReducer from "./reducers/waitersReducer";
import ChefsReducer from "./reducers/chefsReducer";
import MenuReducer from "./reducers/menuReducer";
import DishesReducer from "./reducers/dishesReducer";
import MessageReducer from "./reducers/messageReducer";
//import logger from "redux-logger";
import thunk from "redux-thunk";
import firebase from "firebase/app";
import "firebase/firestore/dist/index.cjs";
const REACT_APP_API_KEY = "AIzaSyCjdRjbEsEvFCTdY83qP0Xzn-DWLiLzkJY";
const REACT_APP_AUTH_DOMAIN = "queue-breaker.firebaseapp.com";
const REACT_APP_DATABASE_URL = "https://queue-breaker.firebaseio.com";
const REACT_APP_PROJECT_ID = "queue-breaker";
const REACT_APP_STORAGE_BUCKET = "queue-breaker.appspot.com";
const REACT_APP_MESSAGE_SENDER_ID = 367217903371;

export const store = createStore(
  combineReducers({
    AuthReducer,
    RestaurantReducer,
    OrderReducer,
    MenuReducer,
    DishesReducer,
    TablesReducer,
    WaitersReducer,
    ChefsReducer,
    MessageReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
);

export const config = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  databaseURL: REACT_APP_DATABASE_URL,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGE_SENDER_ID
};

firebase.initializeApp(config);

export const firestore = firebase.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);
