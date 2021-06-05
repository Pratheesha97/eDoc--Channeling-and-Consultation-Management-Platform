import {
  GET_WORKSCHEDULES,
  DELETE_WORKSCHEDULE,
  ADD_WORKSCHEDULE,
} from "../actions/types.js";

const initialState = {
  workSchedules: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_WORKSCHEDULES:
      return {
        ...state,
        workSchedules: action.payload,
      };
    case DELETE_WORKSCHEDULE:
      return {
        ...state,
        workSchedules: state.workSchedules.filter(
          (workSchedule) => workSchedule.id !== action.payload
        ),
      };
    case ADD_WORKSCHEDULE:
      return {
        ...state,
        workSchedules: [...state.workSchedules, action.payload],
      };
    default:
      return state;
  }
}
