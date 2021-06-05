import axios from "axios";
import { returnErrors, createMessage } from "./messages";

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  REGISTER_BY_STAFF_FAIL,
  REGISTER_BY_STAFF_SUCCESS,
  UPDATE_AUTH_USER,
  DELETE_AUTH_USER,
} from "./types";

// CHECK TOKEN & LOAD USER.
export const loadUser = () => (dispatch, getState) => {
  //User Loading
  dispatch({ type: USER_LOADING });

  axios
    .get("/api/auth/user", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

//LOGIN USER
export const login = (email, password) => (dispatch) => {
  //Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  axios
    .post("/api/auth/login", body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

//LOGIN PATIENT
export const patientLogin = (email, password) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  axios
    .post("/api/auth/patient_login", body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

//LOGIN DOCTOR
export const doctorLogin = (email, password) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  axios
    .post("/api/auth/doctor_login", body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

//LOGIN STAFF
export const staffLogin = (email, password) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  axios
    .post("/api/auth/staff_login", body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

//REGISTER USER
export const register =
  ({ password, email }) =>
  (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email, password });

    axios
      .post("/api/auth/register", body, config)
      .then((res) => {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: REGISTER_FAIL,
        });
      });
  };

//PATIENT REGISTER USER
export const patientRegister =
  ({ first_name, last_name, email, password }) =>
  (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ first_name, last_name, email, password });
    axios
      .post("/api/auth/patient_register", body, config)
      .then((res) => {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: REGISTER_FAIL,
        });
      });
  };

//PATIENT REGISTER BY STAFF
export const patientRegisterByStaff =
  ({ first_name, last_name, email, password }, fetchPatientInfo) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ first_name, last_name, email, password });

    await axios
      .post("/api/auth/patient_register", body, config)
      .then(async (res) => {
        dispatch({
          type: REGISTER_BY_STAFF_SUCCESS,
          payload: res.data,
        });
        try {
          await fetchPatientInfo();
        } catch {
          console.log("error");
        }
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: REGISTER_BY_STAFF_FAIL,
        });
      });
  };

//DOCTOR REGISTER USER
export const doctorRegister =
  ({ first_name, last_name, email, password }, fetchDoctorInfo) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ first_name, last_name, email, password });

    await axios
      .post("/api/auth/doctor_register", body, config)
      .then(async (res) => {
        dispatch({
          type: REGISTER_BY_STAFF_SUCCESS,
          payload: res.data,
        });
        try {
          await fetchDoctorInfo();
        } catch {
          console.log("error");
        }
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: REGISTER_BY_STAFF_FAIL,
        });
      });
  };

//STAFF REGISTER USER
export const staffRegister =
  ({ password, email }) =>
  (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ email, password });
    axios
      .post("/api/auth/staff_register", body, config)
      .then((res) => {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: REGISTER_FAIL,
        });
      });
  };

//LOGOUT USER
export const logout = () => (dispatch, getState) => {
  axios
    .post("/api/auth/logout/", null, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const tokenConfig = (getState) => {
  const token = getState().auth.token;
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  return config;
};

//=========================================== Delete Doctor =============================================

//DELETE DOCTOR USER WITHOUT TOKEN
export const authUserDeleteNoToken = (id) => (dispatch) => {
  axios
    .delete(`/api/userNonAuth/${id}/`)
    .then((res) => {
      dispatch(
        createMessage({
          authUserDelete: "Account has been deleted Successfully!",
        })
      );
      dispatch({
        type: DELETE_AUTH_USER,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};

//=========================================== Update user models when extended user models are updated =============================================
export const authUserUpdate =
  (id, first_name, last_name, email, ErrorsFound) =>
  async (dispatch, getState) => {
    const body = JSON.stringify({ first_name, last_name, email });
    await axios
      .patch(`/api/user/${id}/`, body, tokenConfig(getState), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch(
          createMessage({
            authUserUpdate: "Your profile has been updated successfully",
          })
        );
        dispatch({
          type: UPDATE_AUTH_USER,
          payload: res.data,
        });
      })
      .catch((err) => {
        ErrorsFound();
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };
