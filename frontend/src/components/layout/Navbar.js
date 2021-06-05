import React from "react";
import "../layout/css/NavbarStyle.css";
import companyLogo from "../layout/images/logo5.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = (props) => {
  const { isAuthenticated, user } = props.auth;

  const authLinks = (
    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
      <span className="navbar-text mr-3">
        <strong>{user ? `Welcome, ${user.first_name}!` : ""}</strong>
      </span>
      <form className="form-inline ">
        <button
          type="button"
          className="btn btn-outline-light rounded-pill"
          onClick={() => {
            props.logout();
            location.href = "/";
          }}
        >
          <b>Logout</b>
        </button>
      </form>
    </ul>
  );

  const guestLinks = (
    <form className="form-inline ">
      <button
        type="button"
        className="btn btn-outline-light rounded-pill"
        onClick={() => {
          props.signInOutSwitch();
        }}
      >
        <b>Login</b>
      </button>
      <button
        className="btn btn-outline-light rounded-pill ml-3 mr-3"
        type="button"
        onClick={() => {
          props.signUpSwitch();
        }}
      >
        <b>Register</b>
      </button>
    </form>
  );

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark ${
        isAuthenticated ? "bg-dark" : "headerZIndex"
      } header`}
    >
      <a className="navbar-brand" href={isAuthenticated ? null : ""}>
        <img src={companyLogo} width="80" height="50" />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav mr-auto align-middle">
          {isAuthenticated ? (
            ""
          ) : (
            <li className="nav-item active">
              <a className="nav-link" href="">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
          )}
        </ul>
        {!props.isDoctorMode && !props.isStaffMode
          ? isAuthenticated
            ? authLinks
            : guestLinks
          : ""}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
