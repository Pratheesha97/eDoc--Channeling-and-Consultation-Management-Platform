import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import {
  GET_TREATMENTPLANS,
  ADD_TREATMENTPLAN,
  UPDATE_TREATMENTPLAN,
  GET_SPECIFIC_TREATMENTPLAN,
} from "./types";

//GET TREATMENTPLAN
export const getTreatmentPlans = () => (dispatch, getState) => {
  axios
    .get("/api/treatmentPlan", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_TREATMENTPLANS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET TREATMENTPLAN NO TOKEN
export const getTreatmentPlansNoToken = () => async (dispatch) => {
  await axios
    .get("/api/treatmentPlanNonAuth")
    .then((res) => {
      dispatch({
        type: GET_TREATMENTPLANS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//GET SPECIFIC TREATMENTPLAN
export const getTreatmentPlan = (id) => (dispatch, getState) => {
  axios
    .get("/api/treatmentPlan/" + `${id}`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_SPECIFIC_TREATMENTPLAN,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//ADD TREATMENTPLAN
export const addTreatmentPlan = (TreatmentPlan) => (dispatch, getState) => {
  axios
    .post("/api/treatmentPlan/", TreatmentPlan, tokenConfig(getState), {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({
          addTreatmentPlan: "Treatment Plan Saved Successfully!",
        })
      );
      dispatch({
        type: ADD_TREATMENTPLAN,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//ADD TREATMENTPLAN NO TOKEN
export const addTreatmentPlanNoToken = (TreatmentPlan) => (dispatch) => {
  axios
    .post("/api/treatmentPlanNonAuth/", TreatmentPlan, {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({
          addTreatmentPlan: "Treatment Plan Saved Successfully!",
        })
      );
      dispatch({
        type: ADD_TREATMENTPLAN,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//UPDATE TREATMENTPLAN
export const updateTreatmentPlan =
  (id, TreatmentPlan) => (dispatch, getState) => {
    axios
      .put(`/api/treatmentPlan/${id}/`, TreatmentPlan, tokenConfig(getState), {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
      })
      .then((res) => {
        dispatch(
          createMessage({
            updateTreatmentPlan: "Treatment Plan Updated Successfully!",
          })
        );
        dispatch({
          type: UPDATE_TREATMENTPLAN,
          payload: res.data,
        });
      })
      .catch((err) =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

//UPDATE TREATMENTPLAN NO TOKEN
export const updateTreatmentPlanNoToken = (id, TreatmentPlan) => (dispatch) => {
  axios
    .put(`/api/treatmentPlanNonAuth/${id}/`, TreatmentPlan, {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({
          updateTreatmentPlan: "Treatment Plan Updated Successfully!",
        })
      );
      dispatch({
        type: UPDATE_TREATMENTPLAN,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
