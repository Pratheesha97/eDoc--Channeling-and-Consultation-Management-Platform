import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import {
  GET_PRESCRIPTIONS,
  ADD_PRESCRIPTION,
  DELETE_PRESCRIPTION,
  UPDATE_PRESCRIPTION,
  GET_SPECIFIC_PRESCRIPTION,
} from "./types";

//GET PRESCRIPTION
export const getPrescriptions = () => (dispatch, getState) => {
  axios
    .get("/api/prescription", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_PRESCRIPTIONS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET PRESCRIPTION NO TOKEN
export const getPrescriptionsNoToken = () => async (dispatch) => {
  await axios
    .get("/api/prescriptionNonAuth")
    .then((res) => {
      dispatch({
        type: GET_PRESCRIPTIONS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET SPECIFIC PRESCRIPTION
export const getPrescription = (id) => (dispatch, getState) => {
  axios
    .get("/api/prescription/" + `${id}`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_SPECIFIC_PRESCRIPTION,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//ADD PRESCRIPTION
export const addPrescription = (Prescription) => (dispatch, getState) => {
  axios
    .post("/api/prescription/", Prescription, tokenConfig(getState), {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({ addPrescription: "Prescription created Successfully!" })
      );
      dispatch({
        type: ADD_PRESCRIPTION,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//ADD PRESCRIPTION NO TOKEN
export const addPrescriptionNoToken = (Prescription) => (dispatch) => {
  axios
    .post("/api/prescriptionNonAuth/", Prescription, {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({ addPrescription: "Prescription created Successfully!" })
      );
      dispatch({
        type: ADD_PRESCRIPTION,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//UPDATE PRESCRIPTION
export const updatePrescription =
  (id, Prescription) => (dispatch, getState) => {
    axios
      .put(`/api/prescription/${id}/`, Prescription, tokenConfig(getState), {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
      })
      .then((res) => {
        dispatch(
          createMessage({
            updatePrescription: "Prescription has been updated Successfully!",
          })
        );
        dispatch({
          type: UPDATE_PRESCRIPTION,
          payload: res.data,
        });
      })
      .catch((err) =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

//DELETE PRESCRIPTION
export const deletePrescription = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/prescription/${id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(
        createMessage({
          deletePrescription: "Prescription Deleted Successfully!",
        })
      );
      dispatch({
        type: DELETE_PRESCRIPTION,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};

//DELETE PRESCRIPTION NO TOKEN
export const deletePrescriptionNoToken = (id) => (dispatch) => {
  axios
    .delete(`/api/prescriptionNonAuth/${id}/`)
    .then((res) => {
      dispatch(
        createMessage({
          deletePrescription: "Prescription Deleted Successfully!",
        })
      );
      dispatch({
        type: DELETE_PRESCRIPTION,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};
