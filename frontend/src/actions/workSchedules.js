import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import {
  GET_WORKSCHEDULES,
  ADD_WORKSCHEDULE,
  DELETE_WORKSCHEDULE,
} from "./types";

//GET WORKSCHEDULE
export const getWorkSchedules = () => async (dispatch, getState) => {
  await axios
    .get("/api/workSchedule", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_WORKSCHEDULES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET WORKSCHEDULE WITHOUT TOKEN
export const getWorkSchedulesNoToken = () => async (dispatch) => {
  await axios
    .get("/api/workScheduleNonAuth")
    .then((res) => {
      dispatch({
        type: GET_WORKSCHEDULES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//ADD WORKSCHEDULE
export const addWorkSchedule = (workSchedule) => (dispatch, getState) => {
  axios
    .post("/api/workSchedule/", workSchedule, tokenConfig(getState))
    .then((res) => {
      dispatch(
        createMessage({
          addWorkSchedule: "Work Schedule Updated Successfully!",
        })
      );
      dispatch({
        type: ADD_WORKSCHEDULE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//DELETE WORKSCHEDULE
export const deleteWorkSchedule = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/workSchedule/${id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DELETE_WORKSCHEDULE,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};
