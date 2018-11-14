import { firestore } from "../store";

export const RESTAURANTS = "restaurants";

export const ADD_RESTAURANTS = "ADD_RESTAURANTS";
export const ADD_RESTAURANTS_BEGIN = "ADD_RESTAURANTS_BEGIN";
export const ADD_RESTAURANTS_SUCCESS = "ADD_RESTAURANTS_SUCCESS";
export const ADD_RESTAURANTS_ERROR = "ADD_RESTAURANTS_ERROR";

export const EDIT_RESTAURANTS = "EDIT_RESTAURANTS";
export const EDIT_RESTAURANTS_BEGIN = "ADD_RESTAURANTS_BEGIN";
export const EDIT_RESTAURANTS_SUCCESS = "ADD_RESTAURANTS_SUCCESS";
export const EDIT_RESTAURANTS_ERROR = "EDIT_RESTAURANTS_ERROR";

export const FETCH_RESTAURANTS = "FETCH_RESTAURANTS";
export const FETCH_RESTAURANTS_BEGIN = "FETCH_RESTAURANTS_BEGIN";
export const FETCH_RESTAURANTS_SUCCESS = "FETCH_RESTAURANTS_SUCCESS";
export const FETCH_RESTAURANTS_ERROR = "FETCH_RESTAURANTS_ERROR";

export const DELETE_RESTAURANTS = "DELETE_RESTAURANTS";
export const DELETE_RESTAURANTS_BEGIN = "DELETE_RESTAURANTS_BEGIN";
export const DELETE_RESTAURANTS_SUCCESS = "DELETE_RESTAURANTS_SUCCESS";
export const DELETE_RESTAURANTS_ERROR = "DELETE_RESTAURANTS_ERROR";

export const FETCH_CURRENT_RESTAURANT_BEGIN = "FETCH_CURRENT_RESTAURANT_BEGIN";
export const FETCH_CURRENT_RESTAURANT_SUCCESS =
  "FETCH_CURRENT_RESTAURANT_SUCCESS";
export const RESET_CURRENT_RESTAURANT = "RESET_CURRENT_RESTAURANT";
export function fetchRestaurants() {
  return dispatch => {
    dispatch(fetchRestaurantsBegin());
    const restaurantsRef = firestore.collection(RESTAURANTS).orderBy("name");
    restaurantsRef.onSnapshot(querySnapshot => {
      const restaurants = [];
      querySnapshot.forEach(doc => {
        restaurants.push(doc.data());
      });
      dispatch(fetchRestaurantsSuccess(restaurants));
    });
  };
}
export const resetCurrentRestaurant = () => ({
  type: RESET_CURRENT_RESTAURANT
});
export function fetchCurrentRestaurant(restaurantId) {
  return dispatch => {
    dispatch(fetchCurrentRestaurantBegin());
    const restaurantRef = firestore.collection(RESTAURANTS).doc(restaurantId);
    restaurantRef.get().then(docSnapshot => {
      const restaurant = docSnapshot.data();
      dispatch(fetchCurrentRestaurantSuccess(restaurant));
    });
  };
}

export const fetchCurrentRestaurantBegin = () => ({
  type: FETCH_CURRENT_RESTAURANT_BEGIN
});

export const fetchCurrentRestaurantSuccess = restaurant => ({
  type: FETCH_CURRENT_RESTAURANT_SUCCESS,
  payload: restaurant
});

export const fetchRestaurantsBegin = () => ({
  type: FETCH_RESTAURANTS_BEGIN
});

export const fetchRestaurantsSuccess = restaurants => ({
  type: FETCH_RESTAURANTS_SUCCESS,
  payload: restaurants
});

export const fetchRestaurantsError = error => ({
  type: FETCH_RESTAURANTS_ERROR,
  payload: { error }
});

export function addRestaurants(restaurant) {
  return dispatch => {
    dispatch(addRestaurantsBegin());
    const newRestaurantRef = firestore.collection(RESTAURANTS).doc();
    restaurant.restaurantId = newRestaurantRef.id;
    newRestaurantRef
      .set(restaurant)
      .then(() => {
        dispatch(addRestaurantsSuccess());
      })
      .catch(error => {
        dispatch(addRestaurantsError(error));
      });
  };
}

export const addRestaurantsBegin = () => ({
  type: ADD_RESTAURANTS_BEGIN
});

export const addRestaurantsSuccess = () => ({
  type: ADD_RESTAURANTS_SUCCESS
});

export const addRestaurantsError = error => ({
  type: ADD_RESTAURANTS_ERROR,
  payload: { error }
});

export function editRestaurants(restaurant) {
  return dispatch => {
    dispatch(editRestaurantsBegin());
    const restaurantRef = firestore
      .collection(RESTAURANTS)
      .doc(restaurant.restaurantId);
    restaurantRef
      .set(restaurant)
      .then(() => {
        dispatch(editRestaurantsSuccess());
      })
      .catch(error => {
        dispatch(editRestaurantsError(error));
      });
  };
}

export const editRestaurantsBegin = () => ({
  type: EDIT_RESTAURANTS_BEGIN
});

export const editRestaurantsSuccess = () => ({
  type: EDIT_RESTAURANTS_SUCCESS
});

export const editRestaurantsError = error => ({
  type: EDIT_RESTAURANTS_ERROR,
  payload: { error }
});

export function deleteRestaurants(restaurant) {
  return dispatch => {
    dispatch(deleteRestaurantsBegin());
    const restaurantRef = firestore
      .collection(RESTAURANTS)
      .doc(restaurant.restaurantId);
    restaurantRef
      .delete()
      .then(() => {
        dispatch(deleteRestaurantsSuccess());
      })
      .catch(error => {
        dispatch(deleteRestaurantsError(error));
      });
  };
}

export const deleteRestaurantsBegin = () => ({
  type: DELETE_RESTAURANTS_BEGIN
});

export const deleteRestaurantsSuccess = () => ({
  type: DELETE_RESTAURANTS_SUCCESS
});

export const deleteRestaurantsError = error => ({
  type: DELETE_RESTAURANTS_ERROR,
  payload: { error }
});
