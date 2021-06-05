import React from "react";
import "../guestUserMode/css/guestUserMode.css";
import PatientSignUp from "../accounts/PatientSignUp";
import PatientSignIn from "../accounts/PatientSignIn";
import DoctorSignIn from "../accounts/DoctorSignIn";
import { Link } from "react-router-dom";
import StaffSignIn from "../accounts/StaffSignIn";

const heading = {
  color: "white",
  fontSize: "75px",

  textShadow: "4px 4px 6px #333333",

  //fontFamily: "Open Sans",
};

const headingLogo = {
  marginTop: "-40px",
  position: "relative",
  marginLeft: "20px",
};

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDoctorMode: this.props.isDoctorMode,
      showSignInComponent: this.props.showSignInComponent,
      showSignUpComponent: this.props.showSignUpComponent,
      isStaffMode: this.props.isStaffMode,
    };
    this.goToPatientMode = this.goToPatientMode.bind(this);
    this.doctorSignInComponent = this.doctorSignInComponent.bind(this);
    this.patientSignInComponent = this.patientSignInComponent.bind(this);
    this.signUpComponent = this.signUpComponent.bind(this);
    this.staffSignInComponent = this.staffSignInComponent.bind(this);
  }

  goToPatientMode() {
    location.reload();
  }

  doctorSignInComponent() {
    this.setState({
      isDoctorMode: true,
      showSignInComponent: true,
      showSignUpComponent: false,
      isStaffMode: false,
    });
  }

  patientSignInComponent() {
    this.setState({
      isDoctorMode: false,
      showSignInComponent: true,
      showSignUpComponent: false,
      isStaffMode: false,
    });
  }

  signUpComponent() {
    this.setState({
      isDoctorMode: false,
      showSignInComponent: false,
      showSignUpComponent: true,
      isStaffMode: false,
    });
  }

  staffSignInComponent() {
    this.setState({
      isDoctorMode: false,
      showSignInComponent: false,
      showSignUpComponent: false,
      isStaffMode: true,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="Homebackground h-100">
          <table className="w-100 responsive full-screen-table">
            <tbody>
              <tr>
                <td className="w-50">
                  <div className="text-center">
                    <h1 style={heading}>
                      Welcome to <br></br>eDoc
                    </h1>
                    <h4 className="mt-5 slogan">
                      E X C E P T I O N A L &nbsp;&nbsp; T E C H N O L O G Y.{" "}
                      <br></br>E X T R A O R D I N A R Y &nbsp;&nbsp; C A R E.
                    </h4>
                  </div>
                </td>
                <td className="w-50 text-center">
                  {this.state.showSignUpComponent ? (
                    <React.Fragment>
                      <PatientSignUp
                        signInOutSwitch={this.patientSignInComponent}
                      />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {this.state.isDoctorMode ? (
                        <React.Fragment>
                          <div>
                            <DoctorSignIn />
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          {this.state.showSignInComponent ? (
                            <div>
                              <PatientSignIn
                                signUpSwitch={this.signUpComponent}
                              />
                            </div>
                          ) : this.state.isStaffMode ? (
                            <React.Fragment>
                              <div>
                                <StaffSignIn />
                              </div>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <div className="mt-5 mb-5">
                                <div className="hp-cards">
                                  <div className="homepage-card-wrapper">
                                    <div
                                      className="homepage-card"
                                      onClick={() => {
                                        this.props.signInOutSwitch();
                                      }}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <h1 className="card-font">
                                        Find a Doctor
                                      </h1>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-5 mb-5">
                                <div className="hp-cards">
                                  <div className="homepage-card-wrapper">
                                    <div
                                      className="homepage-card"
                                      onClick={() => {
                                        this.props.signInOutSwitch();
                                      }}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <h1 className="card-font">
                                        Book an appointment
                                      </h1>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-5 mb-5">
                                <div className="hp-cards">
                                  <div className="homepage-card-wrapper">
                                    <div
                                      className="homepage-card"
                                      onClick={() => {
                                        this.props.signInOutSwitch();
                                      }}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <h1 className="card-font">
                                        Manage your booking
                                      </h1>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="area">
            <ul className="circles">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>

          <div
            className="btn-group btn-group-toggle login-other"
            data-toggle="buttons"
            style={{
              right: "0px",
              bottom: "0px",
              zIndex: "4",
            }}
          >
            <label
              className="btn btn-dark active btn-sm"
              onClick={this.goToPatientMode}
            >
              <input
                type="radio"
                name="options"
                id="option1"
                autoComplete="off"
                readOnly
                style={{ textAlign: "center" }}
              />
              <span style={{ fontSize: "11px", textAlign: "center" }}>
                Patient Mode
              </span>
            </label>
            <label
              className="btn btn-dark btn-sm"
              onClick={this.doctorSignInComponent}
            >
              <input
                type="radio"
                name="options"
                id="option2"
                autoComplete="off"
              />
              <span style={{ fontSize: "11px" }}>Doctor Login</span>
            </label>
            <label
              className="btn btn-dark btn-sm"
              onClick={this.staffSignInComponent}
            >
              <input
                type="radio"
                name="options"
                id="option3"
                autoComplete="off"
              />
              <span style={{ fontSize: "11px" }}>Staff Login</span>
            </label>
            <label className="btn btn-dark btn-sm">
              <input
                type="radio"
                name="options"
                id="option4"
                autoComplete="off"
                style={{ textAlign: "center" }}
              />
              <Link to="/admin">
                <span
                  style={{
                    fontSize: "11px",
                    textAlign: "center",
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  Admin Login
                </span>
              </Link>
            </label>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Homepage;
