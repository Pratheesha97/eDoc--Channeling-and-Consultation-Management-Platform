import {
  GET_DOCTORS,
  DELETE_DOCTOR,
  ADD_DOCTOR,
  UPDATE_DOCTOR,
} from "../actions/types.js";

const initialState = {
  doctors: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DOCTORS:
      return {
        ...state,
        doctors: action.payload,
      };
    case DELETE_DOCTOR:
      return {
        ...state,
        doctors: state.doctors.filter((doctor) => doctor.id !== action.payload),
      };
    case ADD_DOCTOR:
      return {
        ...state,
        doctors: [...state.doctors, action.payload],
      };
    case UPDATE_DOCTOR:
      return {
        ...state,
        doctors: action.payload,
      };
    default:
      return state;
  }
}
