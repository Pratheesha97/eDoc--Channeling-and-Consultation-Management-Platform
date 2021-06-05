//meeting place for all the other reducers
import { combineReducers } from "redux";
import patients from "./patients";
import doctors from "./doctors";
import workSchedules from "./workSchedules";
import appointments from "./appointments";
import prescriptions from "./prescriptions";
import treatmentPlans from "./treatmentPlans";
import staffs from "./staffs";
import messages from "./messages";
import errors from "./errors";
import auth from "./auth";

export default combineReducers({
  patients,
  doctors,
  workSchedules,
  appointments,
  prescriptions,
  treatmentPlans,
  staffs,
  messages,
  errors,
  auth,
});
