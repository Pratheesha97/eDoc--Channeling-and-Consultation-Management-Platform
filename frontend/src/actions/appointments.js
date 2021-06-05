import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import {
  GET_APPOINTMENTS,
  ADD_APPOINTMENT,
  UPDATE_APPOINTMENT,
  GET_SPECIFIC_APPOINTMENT,
} from "./types";

//GET APPOINTMENT WITH TOKEN
export const getAppointments = () => async (dispatch, getState) => {
  await axios
    .get("/api/appointment", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_APPOINTMENTS,
        payload: res.data,
      });
    })
    .catch(
      (err) => dispatch(returnErrors(err.response.data, err.response.status)) //Step 10.
    );
};

//GET APPOINTMENT WITHOUT TOKEN
export const getAppointmentsNoToken = () => async (dispatch) => {
  await axios
    .get("/api/appointmentNonAuth")
    .then((res) => {
      dispatch({
        type: GET_APPOINTMENTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("error", err);
    });
};

//GET SPECIFIC APPOINTMENT
export const getAppointment = (id) => (dispatch, getState) => {
  axios
    .get("/api/appointment/" + `${id}`, tokenConfig(getState))
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_SPECIFIC_APPOINTMENT,
        payload: res.data,
      });
    })
    .catch(
      (err) => dispatch(returnErrors(err.response.data, err.response.status)) //Step 10.
    );
};

//ADD APPOINTMENT
export const addAppointment = (Appointment) => (dispatch, getState) => {
  axios
    .post("/api/appointment/", Appointment, tokenConfig(getState), {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({
          addAppointment: "Your Appointment has been booked Successfully!",
        })
      );
      dispatch({
        type: ADD_APPOINTMENT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//ADD APPOINTMENT NO TOKEN
export const addAppointmentNoToken = (Appointment) => (dispatch) => {
  axios
    .post("/api/appointmentNonAuth/", Appointment, {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({
          addAppointment: "Your Appointment has been booked Successfully!",
        })
      );
      dispatch({
        type: ADD_APPOINTMENT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//UPDATE APPOINTMENT
export const updateAppointment = (id, Appointment) => (dispatch, getState) => {
  axios
    .patch(`/api/appointment/${id}/`, Appointment, tokenConfig(getState), {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({
          updateAppointment:
            "Your Appointment has been cancelled Successfully!",
        })
      );
      dispatch({
        type: UPDATE_APPOINTMENT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//UPDATE APPOINTMENT NO TOKEN
export const updateAppointmentNoToken = (id, Appointment) => (dispatch) => {
  axios
    .patch(`/api/appointmentNonAuth/${id}/`, Appointment, {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({
          updateAppointment:
            "Your Appointment has been cancelled Successfully!",
        })
      );
      dispatch({
        type: UPDATE_APPOINTMENT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
