import {
  GET_STAFFS,
  DELETE_STAFF,
  ADD_STAFF,
  UPDATE_STAFF,
} from "../actions/types.js";

const initialState = {
  staffs: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_STAFFS:
      return {
        ...state,
        staffs: action.payload,
      };
    case DELETE_STAFF:
      return {
        ...state,
        staffs: state.staffs.filter((staff) => staff.id !== action.payload),
      };
    case ADD_STAFF:
      return {
        ...state,
        staffs: [...state.staffs, action.payload],
      };
    case UPDATE_STAFF:
      return {
        ...state,
        staffs: action.payload,
      };
    default:
      return state;
  }
}
