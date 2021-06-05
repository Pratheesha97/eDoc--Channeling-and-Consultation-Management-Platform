import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";
import doctors from "../reducers/doctors";

import { GET_DOCTORS, ADD_DOCTOR, UPDATE_DOCTOR } from "./types";

//GET DOCTOR WITH TOKEN
export const getDoctors = () => async (dispatch, getState) => {
  await axios
    .get("/api/doctor", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_DOCTORS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET DOCTOR WITHOUT TOKEN
export const getDoctorsNoToken = () => async (dispatch) => {
  await axios
    .get("/api/doctorNonAuth")
    .then((res) => {
      dispatch({
        type: GET_DOCTORS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET DOCTOR WITHOUT TOKEN
export const getDoctorNoToken = (id) => async (dispatch) => {
  await axios
    .get(`/api/doctorNonAuth/${id}`)
    .then((res) => {
      dispatch({
        type: GET_DOCTORS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//ADD DOCTOR
export const addDoctor = (doctor) => (dispatch, getState) => {
  axios
    .post("/api/doctor/", doctor, tokenConfig(getState), {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({
          addDoctor: "Your profile has been created successfully",
        })
      );
      dispatch({
        type: ADD_DOCTOR,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//UPDATE DOCTOR
export const updateDoctor =
  (id, doctor, showSuccess, ErrorsFoundMethod) =>
  async (dispatch, getState) => {
    await axios
      .patch(`/api/doctor/${id}/`, doctor, tokenConfig(getState), {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
      })
      .then((res) => {
        if (showSuccess) {
          dispatch(
            createMessage({
              updateDoctor: "Your profile has been updated successfully",
            })
          );
        }
        dispatch({
          type: UPDATE_DOCTOR,
          payload: res.data,
        });
      })
      .catch((err) => {
        ErrorsFoundMethod();
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };

//UPDATE DOCTOR WITHOUT TOKEN
export const updateDoctorNoToken =
  (id, doctor) => async (dispatch, getState) => {
    await axios
      .put(`/api/doctorNonAuth/${id}/`, doctor, tokenConfig(getState), {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
      })
      .then((res) => {
        dispatch(
          createMessage({
            updateDoctorNoToken: "Doctor Account Created Successfully!",
          })
        );
        dispatch({
          type: UPDATE_DOCTOR,
          payload: res.data,
        });
      })
      .catch((err) =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };
