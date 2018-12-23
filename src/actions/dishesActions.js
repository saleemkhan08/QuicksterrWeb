import { firestore } from "../store";
import { RESTAURANTS } from "../views/RestaurantPage/restaurantActions";
import { CATEGORIES } from "./menuActions";
export const DISHES = "dishes";

export const ADD_DISHES = "ADD_DISHES";
export const ADD_DISHES_BEGIN = "ADD_DISHES_BEGIN";
export const ADD_DISHES_SUCCESS = "ADD_DISHES_SUCCESS";
export const ADD_DISHES_ERROR = "ADD_DISHES_ERROR";

export const EDIT_DISHES = "EDIT_DISHES";
export const EDIT_DISHES_BEGIN = "ADD_DISHES_BEGIN";
export const EDIT_DISHES_SUCCESS = "ADD_DISHES_SUCCESS";
export const EDIT_DISHES_ERROR = "EDIT_DISHES_ERROR";

export const FETCH_DISHES = "FETCH_DISHES";
export const FETCH_DISHES_BEGIN = "FETCH_DISHES_BEGIN";
export const FETCH_DISHES_SUCCESS = "FETCH_DISHES_SUCCESS";
export const FETCH_DISHES_ERROR = "FETCH_DISHES_ERROR";

export const DELETE_DISHES = "DELETE_DISHES";
export const DELETE_DISHES_BEGIN = "DELETE_DISHES_BEGIN";
export const DELETE_DISHES_SUCCESS = "DELETE_DISHES_SUCCESS";
export const DELETE_DISHES_ERROR = "DELETE_DISHES_ERROR";

function dishesCollectionRef(restaurantId, categoryId) {
  return firestore
    .collection(RESTAURANTS)
    .doc(restaurantId)
    .collection(CATEGORIES)
    .doc(categoryId)
    .collection(DISHES);
}
export function fetchDishes(restaurantId, categoryId) {
  return dispatch => {
    dispatch(fetchDishesBegin());
    const ref = dishesCollectionRef(restaurantId, categoryId).orderBy("name");
    ref.onSnapshot(querySnapshot => {
      const dishes = [];
      querySnapshot.forEach(doc => {
        dishes.push(doc.data());
      });
      if (dishes.length > 0) {
        dispatch(fetchDishesSuccess(dishes));
      } else {
        dispatch(fetchDishesError());
      }
    });
  };
}

export function fetchAndDeleteDishes(restaurantId, categoryId) {
  const ref = dishesCollectionRef(restaurantId, categoryId);
  return new Promise((resolve, reject) => {
    ref
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          ref.doc(doc.id).delete();
        });
      })
      .then(() => resolve(categoryId))
      .catch(error => reject(error));
  });
}

export function addMenuItems(restaurantId, categoryId, dishes) {
  const ref = dishesCollectionRef(restaurantId, categoryId);
  let dishCount = dishes.length;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < dishes.length; i++) {
      const newDishRef = ref.doc();
      const dish = dishes[i];
      dish.id = newDishRef.id;
      newDishRef
        .set(dish)
        .then(() => {
          dishCount--;
          if (dishCount <= 0) {
            resolve();
          }
        })
        .catch(err => reject(err));
    }
  });
}

export const fetchDishesBegin = () => ({
  type: FETCH_DISHES_BEGIN
});

export const fetchDishesSuccess = dishes => ({
  type: FETCH_DISHES_SUCCESS,
  payload: dishes
});

export const fetchDishesError = () => ({
  type: FETCH_DISHES_ERROR
});

export function addDishes(restaurantId, categoryId, dish) {
  return dispatch => {
    dispatch(addDishesBegin());
    const newDishRef = dishesCollectionRef(restaurantId, categoryId).doc();
    dish.id = newDishRef.id;
    newDishRef
      .set(dish)
      .then(() => {
        dispatch(addDishesSuccess());
      })
      .catch(error => {
        dispatch(addDishesError(error));
      });
  };
}

export const addDishesBegin = () => ({
  type: ADD_DISHES_BEGIN
});

export const addDishesSuccess = () => ({
  type: ADD_DISHES_SUCCESS
});

export const addDishesError = error => ({
  type: ADD_DISHES_ERROR,
  payload: { error }
});

export function editDishes(restaurantId, categoryId, dish) {
  return dispatch => {
    dispatch(editDishesBegin());
    const dishRef = dishesCollectionRef(restaurantId, categoryId).doc(dish.id);
    dishRef
      .set(dish)
      .then(() => {
        dispatch(editDishesSuccess());
      })
      .catch(error => {
        dispatch(editDishesError(error));
      });
  };
}

export const editDishesBegin = () => ({
  type: EDIT_DISHES_BEGIN
});

export const editDishesSuccess = () => ({
  type: EDIT_DISHES_SUCCESS
});

export const editDishesError = error => ({
  type: EDIT_DISHES_ERROR,
  payload: { error }
});

export function deleteDishes(restaurantId, categoryId, dish) {
  return dispatch => {
    dispatch(deleteDishesBegin());
    const dishRef = dishesCollectionRef(restaurantId, categoryId).doc(dish.id);
    dishRef
      .delete()
      .then(() => {
        dispatch(deleteDishesSuccess());
      })
      .catch(error => {
        dispatch(deleteDishesError(error));
      });
  };
}

export const deleteDishesBegin = () => ({
  type: DELETE_DISHES_BEGIN
});

export const deleteDishesSuccess = () => ({
  type: DELETE_DISHES_SUCCESS
});

export const deleteDishesError = error => ({
  type: DELETE_DISHES_ERROR,
  payload: { error }
});
