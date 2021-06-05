import {
  GET_PRESCRIPTIONS,
  DELETE_PRESCRIPTION,
  ADD_PRESCRIPTION,
  UPDATE_PRESCRIPTION,
} from "../actions/types.js";

const initialState = {
  prescriptions: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PRESCRIPTIONS:
      return {
        ...state,
        prescriptions: action.payload,
      };
    case DELETE_PRESCRIPTION:
      return {
        ...state,
        prescriptions: state.prescriptions.filter(
          (prescription) => prescription.id !== action.payload
        ),
      };
    case ADD_PRESCRIPTION:
      return {
        ...state,
        prescriptions: [...state.prescriptions, action.payload],
      };
    case UPDATE_PRESCRIPTION:
      return {
        ...state,
        prescriptions: action.payload,
      };
    default:
      return state;
  }
}
