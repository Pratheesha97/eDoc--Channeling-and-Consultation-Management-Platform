import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_AUTH_USER,
  REGISTER_BY_STAFF_FAIL,
  REGISTER_BY_STAFF_SUCCESS,
  DELETE_AUTH_USER,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  user: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        //set back to the default.
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case REGISTER_BY_STAFF_FAIL:
      return {
        ...state,
      };
    case REGISTER_BY_STAFF_SUCCESS:
      return {
        ...state,
      };
    case UPDATE_AUTH_USER:
      return {
        ...state,
        user: action.payload,
      };
    case DELETE_AUTH_USER:
      return {
        ...state,
        user: state.user.filter((user) => user.id !== action.payload),
      };
    default:
      return state;
  }
}
