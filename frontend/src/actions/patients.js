import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import {
  GET_PATIENTS,
  ADD_PATIENT,
  UPDATE_PATIENT,
  GET_SPECIFIC_PATIENT,
} from "./types";

//GET PATIENT
export const getPatients = () => async (dispatch, getState) => {
  await axios
    .get("/api/patient", tokenConfig(getState))
    .then((res) => {
      console.log("res.data", res.data);
      dispatch({
        type: GET_PATIENTS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET PATIENT WITHOUT TOKEN
export const getPatientsNoToken = () => async (dispatch) => {
  await axios
    .get("/api/patientNonAuth")
    .then((res) => {
      dispatch({
        type: GET_PATIENTS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET SPECIFIC PATIENT
export const getPatient = (id) => async (dispatch, getState) => {
  await axios
    .get("/api/patient/" + `${id}`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_SPECIFIC_PATIENT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET PATIENT WITHOUT TOKEN
export const getPatientNoToken = (id) => async (dispatch) => {
  await axios
    .get("/api/patientNonAuth/" + `${id}`)
    .then((res) => {
      dispatch({
        type: GET_SPECIFIC_PATIENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response != undefined) {
        dispatch(returnErrors(err.response.data, err.response.status));
      }
    });
};

//ADD PATIENT
export const addPatient = (patient) => (dispatch, getState) => {
  axios
    .post("/api/patient/", patient, tokenConfig(getState), {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({
          addPatient: "Your profile has been created successfully",
        })
      );
      dispatch({
        type: ADD_PATIENT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//UPDATE PATIENT
export const updatePatient =
  (id, patient, showSuccess, ErrorsFoundMethod) =>
  async (dispatch, getState) => {
    await axios
      .patch(`/api/patient/${id}/`, patient, tokenConfig(getState), {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
      })
      .then((res) => {
        if (showSuccess) {
          dispatch(
            createMessage({
              updatePatient: "Your profile has been updated successfully",
            })
          );
        }

        dispatch({
          type: UPDATE_PATIENT,
          payload: res.data,
        });
      })
      .catch((err) => {
        ErrorsFoundMethod();
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };

//UPDATE PATIENT WITHOUT TOKEN
export const updatePatientNoToken =
  (id, patient, showSuccess, ErrorsFoundMethod) => async (dispatch) => {
    await axios
      .put(`/api/patientNonAuth/${id}/`, patient, {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
      })
      .then((res) => {
        if (showSuccess) {
          dispatch(
            createMessage({
              updatePatientNoToken: "Patient Account Created Successfully!",
            })
          );
        }
        dispatch({
          type: UPDATE_PATIENT,
          payload: res.data,
        });
      })
      .catch((err) => {
        ErrorsFoundMethod();
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };
