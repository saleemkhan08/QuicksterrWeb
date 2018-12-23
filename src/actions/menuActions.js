import { firestore } from "../store";
import { RESTAURANTS } from "../views/RestaurantPage/restaurantActions";
export const DISPLAY_CATEGORIES_TAB = "DISPLAY_CATEGORIES_TAB";
export const HIDE_CATEGORIES_TAB = "HIDE_CATEGORIES_TAB";
export const CATEGORIES = "menu_categories";
export const SET_CURRENT_CATEGORY = "SET_CURRENT_CATEGORY";

export const ADD_CATEGORIES = "ADD_CATEGORIES";
export const ADD_CATEGORIES_BEGIN = "ADD_CATEGORIES_BEGIN";
export const ADD_CATEGORIES_SUCCESS = "ADD_CATEGORIES_SUCCESS";
export const ADD_CATEGORIES_ERROR = "ADD_CATEGORIES_ERROR";

export const EDIT_CATEGORIES = "EDIT_CATEGORIES";
export const EDIT_CATEGORIES_BEGIN = "ADD_CATEGORIES_BEGIN";
export const EDIT_CATEGORIES_SUCCESS = "ADD_CATEGORIES_SUCCESS";
export const EDIT_CATEGORIES_ERROR = "EDIT_CATEGORIES_ERROR";

export const FETCH_CATEGORIES = "FETCH_CATEGORIES";
export const FETCH_CATEGORIES_BEGIN = "FETCH_CATEGORIES_BEGIN";
export const FETCH_CATEGORIES_SUCCESS = "FETCH_CATEGORIES_SUCCESS";
export const FETCH_CATEGORIES_ERROR = "FETCH_CATEGORIES_ERROR";

export const DELETE_CATEGORIES = "DELETE_CATEGORIES";
export const DELETE_CATEGORIES_BEGIN = "DELETE_CATEGORIES_BEGIN";
export const DELETE_CATEGORIES_SUCCESS = "DELETE_CATEGORIES_SUCCESS";
export const DELETE_CATEGORIES_ERROR = "DELETE_CATEGORIES_ERROR";
export const RESET_MENU = "RESET_MENU";

export const getCategoryCollectionRef = restaurantId => {
  return firestore
    .collection(RESTAURANTS)
    .doc(restaurantId)
    .collection(CATEGORIES);
};

export function fetchCategories(restaurantId) {
  return dispatch => {
    dispatch(fetchCategoriesBegin());
    const categoriesRef = getCategoryCollectionRef(restaurantId).orderBy(
      "name"
    );
    categoriesRef.onSnapshot(querySnapshot => {
      const categories = [];
      querySnapshot.forEach(doc => {
        categories.push(doc.data());
      });
      dispatch(fetchCategoriesSuccess(categories));
      dispatch(setCurrentCategory(categories[0]));
    });
  };
}

export const fetchCategoriesBegin = () => ({
  type: FETCH_CATEGORIES_BEGIN
});

export const resetMenu = () => ({
  type: RESET_MENU
});

export const fetchCategoriesSuccess = categories => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload: categories
});

export const displayCategoriesTabs = () => ({
  type: DISPLAY_CATEGORIES_TAB
});

export const hideCategoriesTabs = () => ({
  type: HIDE_CATEGORIES_TAB
});

export const setCurrentCategory = category => ({
  type: SET_CURRENT_CATEGORY,
  payload: category
});

export function addCategories(restaurantId, category) {
  return dispatch => {
    dispatch(addCategoriesBegin());
    const newCategoryRef = getCategoryCollectionRef(restaurantId).doc();
    category.id = newCategoryRef.id;
    newCategoryRef
      .set(category)
      .then(() => {
        dispatch(addCategoriesSuccess());
      })
      .catch(error => {
        dispatch(addCategoriesError(error));
      });
  };
}

export const addCategoriesBegin = () => ({
  type: ADD_CATEGORIES_BEGIN
});

export const addCategoriesSuccess = () => ({
  type: ADD_CATEGORIES_SUCCESS
});

export const addCategoriesError = error => ({
  type: ADD_CATEGORIES_ERROR,
  payload: { error }
});

export function editCategories(restaurantId, category) {
  return dispatch => {
    dispatch(editCategoriesBegin());
    const categoryRef = getCategoryCollectionRef(restaurantId).doc(category.id);
    categoryRef
      .set(category)
      .then(() => {
        dispatch(editCategoriesSuccess());
      })
      .catch(error => {
        dispatch(editCategoriesError(error));
      });
  };
}

export const editCategoriesBegin = () => ({
  type: EDIT_CATEGORIES_BEGIN
});

export const editCategoriesSuccess = () => ({
  type: EDIT_CATEGORIES_SUCCESS
});

export const editCategoriesError = error => ({
  type: EDIT_CATEGORIES_ERROR,
  payload: { error }
});

export function deleteCategory(restaurantId, categoryId) {
  const categoryRef = getCategoryCollectionRef(restaurantId).doc(categoryId);
  return new Promise((resolve, reject) => {
    categoryRef
      .delete()
      .then(() => {
        resolve("Deleted");
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function addCategory(restaurantId, categoryName) {
  const category = {};
  category.name = categoryName;
  const categoryRef = getCategoryCollectionRef(restaurantId).doc();
  category.id = categoryRef.id;
  return new Promise((resolve, reject) => {
    categoryRef
      .set(category)
      .then(() => {
        resolve(category);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function deleteCategories(restaurantId, categoryId) {
  return dispatch => {
    dispatch(deleteCategoriesBegin());
    const categoryRef = firestore
      .collection(RESTAURANTS)
      .doc(restaurantId)
      .collection(CATEGORIES)
      .doc(categoryId);
    categoryRef
      .delete()
      .then(() => {
        dispatch(deleteCategoriesSuccess());
      })
      .catch(error => {
        dispatch(deleteCategoriesError(error));
      });
  };
}

export const deleteCategoriesBegin = () => ({
  type: DELETE_CATEGORIES_BEGIN
});

export const deleteCategoriesSuccess = () => ({
  type: DELETE_CATEGORIES_SUCCESS
});

export const deleteCategoriesError = error => ({
  type: DELETE_CATEGORIES_ERROR,
  payload: { error }
});
