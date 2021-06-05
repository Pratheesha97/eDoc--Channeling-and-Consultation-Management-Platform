import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import { GET_STAFFS, ADD_STAFF, UPDATE_STAFF } from "./types";

//GET STAFF
export const getStaffs = () => async (dispatch, getState) => {
  await axios
    .get("/api/staff", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_STAFFS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//ADD STAFF
export const addStaff = (staff) => (dispatch, getState) => {
  axios
    .post("/api/staff/", staff, tokenConfig(getState), {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({
          addStaff: "Your profile has been created successfully",
        })
      );
      dispatch({
        type: ADD_STAFF,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//UPDATE STAFF
export const updateStaff = (id, staff) => (dispatch, getState) => {
  axios
    .patch(`/api/staff/${id}/`, staff, tokenConfig(getState), {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    })
    .then((res) => {
      dispatch(
        createMessage({
          updateStaff: "Your profile has been updated successfully",
        })
      );
      dispatch({
        type: UPDATE_STAFF,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
