import {
  ADD_TABLES,
  DELETE_TABLES,
  EDIT_TABLES,
  FETCH_TABLES_BEGIN,
  FETCH_TABLES_SUCCESS
} from "../actions/tablesActions";

const initialState = {
  tables: [],
  isLoading: true,
  error: null,
  drawer: false
};

const TablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TABLES_BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case FETCH_TABLES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        tables: action.payload
      };

    case EDIT_TABLES:
      return {
        ...state
      };

    case DELETE_TABLES:
      return {
        ...state
      };

    case ADD_TABLES:
      return {
        ...state
      };
    default:
      return state;
  }
};

export default TablesReducer;
