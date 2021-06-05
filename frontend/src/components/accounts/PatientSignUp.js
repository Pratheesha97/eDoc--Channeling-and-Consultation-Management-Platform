import React, { useState, Fragment } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import patient from "../guestUserMode/images/patient.jpg";

import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { patientRegister } from "../../actions/auth";
import { createMessage } from "../../actions/messages";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  image: {
    backgroundImage: `url(${patient})`,
    maxWidth: "30%",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(1, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const PatientSignUp = (props) => {
  const classes = useStyles();

  const [first_name, setFName] = useState("");
  const [last_name, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      props.createMessage({ passwordNotMatch: "Passwords do not match" });
    }
    if (
      first_name == "" ||
      last_name == "" ||
      (first_name == "" && last_name == "")
    ) {
      props.createMessage({ passwordNotMatch: "Name fields may not be blank" });
    } else {
      const newUser = {
        first_name,
        last_name,
        email,
        password,
      };
      props.patientRegister(newUser);
    }
  };

  const onChangeFName = (e) => {
    setFName(e.target.value);
  };

  const onChangeLName = (e) => {
    setLName(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangePassword2 = (e) => {
    setPassword2(e.target.value);
  };

  const render = (e) => {
    if (props.isAuthenticated) {
      return <Redirect to="/home" />;
    }
  };

  return (
    <Fragment>
      {render()}
      <div className="fadeInUp animate one removeBlur">
        <Grid
          container
          component="main"
          className={classes.root}
          justify="center"
        >
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            className={classes.image}
            style={{
              borderRadius: "30px 0px 0px 90px",
              boxShadow:
                "0 56px 112px rgba(0.80, 0.80, 0.80, 0.82), 0 30px 30px rgba(0, 0, 0, 0.22)",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
            style={{
              borderRadius: "0px 90px 30px 0px",
              boxShadow:
                "0 56px 112px rgba(0, 0, 0, 0.40), 0 30px 30px rgba(0, 0, 0, 0.22)",
            }}
          >
            <div className={classes.paper}>
              <Avatar
                className={classes.avatar}
                style={{
                  margin: "auto",
                  marginBottom: "10px",
                  marginTop: "20px",
                }}
              >
                <LockOutlinedIcon />
              </Avatar>
              <Typography
                component="h1"
                variant="h5"
                style={{ fontSize: "20px" }}
              >
                Sign up
              </Typography>
              <form className={classes.form} noValidate onSubmit={onSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="first_name"
                      variant="outlined"
                      value={first_name}
                      onChange={onChangeFName}
                      size="small"
                      required
                      inputProps={{ style: { fontSize: "13px" } }}
                      fullWidth
                      id="firstName"
                      label={
                        <span style={{ fontSize: "12px" }}>First Name</span>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      inputProps={{ style: { fontSize: "13px" } }}
                      fullWidth
                      id="lastName"
                      label={
                        <span style={{ fontSize: "12px" }}>Last Name</span>
                      }
                      name="last_name"
                      value={last_name}
                      onChange={onChangeLName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      inputProps={{ style: { fontSize: "13px" } }}
                      fullWidth
                      id="email"
                      label={
                        <span style={{ fontSize: "12px" }}>Email Address</span>
                      }
                      name="email"
                      value={email}
                      onChange={onChangeEmail}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      name="password"
                      label={<span style={{ fontSize: "12px" }}>Password</span>}
                      type="password"
                      id="password"
                      value={password}
                      onChange={onChangePassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      name="password2"
                      label={
                        <span style={{ fontSize: "12px" }}>
                          Confirm Password
                        </span>
                      }
                      type="password"
                      id="password2"
                      value={password2}
                      onChange={onChangePassword2}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign Up
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link
                      href="#"
                      variant="body2"
                      onClick={() => {
                        props.signInOutSwitch();
                      }}
                    >
                      <span style={{ fontSize: "12px" }}>
                        Already have an account? Sign in
                      </span>
                    </Link>
                  </Grid>
                </Grid>
                <div style={{ paddingTop: "20px", bottom: "0px" }}></div>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { patientRegister, createMessage })(
  PatientSignUp
);
