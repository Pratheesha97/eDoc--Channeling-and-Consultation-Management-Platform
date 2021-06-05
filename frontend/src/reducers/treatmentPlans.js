import {
  GET_TREATMENTPLANS,
  DELETE_TREATMENTPLAN,
  ADD_TREATMENTPLAN,
  UPDATE_TREATMENTPLAN,
} from "../actions/types.js";

const initialState = {
  treatmentPlans: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TREATMENTPLANS:
      return {
        ...state,
        treatmentPlans: action.payload,
      };
    case DELETE_TREATMENTPLAN:
      return {
        ...state,
        treatmentPlans: state.treatmentPlans.filter(
          (treatmentPlan) => treatmentPlan.id !== action.payload
        ),
      };
    case ADD_TREATMENTPLAN:
      return {
        ...state,
        treatmentPlans: [...state.treatmentPlans, action.payload],
      };
    case UPDATE_TREATMENTPLAN:
      return {
        ...state,
        treatmentPlans: action.payload,
      };
    default:
      return state;
  }
}
