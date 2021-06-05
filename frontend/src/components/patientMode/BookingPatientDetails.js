import React, { Component, Fragment, useState, useMemo } from "react";
import "../guestUserMode/css/guestUserMode.css";
import profilePictureMale from "../doctorMode/images/doctorImages/profilePictureMale.jpg";
import Select from "react-select";
import patients from "../../reducers/patients";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getPatients } from "../../actions/patients";
import axios from "axios";
import DropDownOptions from "./DropDownOptions";

var patientTitle = "";
var patientFName = "";
var patientLName = "";
var patientNationality = "";
var patientIdentification = "";
var patientEmail = "";

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/media/doctor_profile_images/Default.png";

export class BookingPatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientID: "",
      patientImage: "",
      patientTitle: "",
      patientFName: "",
      patientLName: "",
      patientPhone: "",
      patientGender: "",
      patientNationality: "",
      patientIdentification: "",
      patientEmail: "",
      appointmentNumber: this.props.appointmentNumber,
      appointmentDate: this.props.appointmentDate,
      appointmentTime: this.props.appointmentTime,
      bookedDoctorID: this.props.bookedDoctorID,
      bookedDoctorFName: this.props.bookedDoctorFName,
      bookedDoctorLName: this.props.bookedDoctorLName,
      bookedDoctorImage: this.props.bookedDoctorImage,
      bookedDoctorSpecialization: this.props.bookedDoctorSpecialization,
      bookedDoctorQualification: this.props.bookedDoctorQualification,
      bookedChannellingFee: this.props.bookedChannellingFee,
      viewPatientNationality: true,
      nationOptions: null,
    };
  }

  static propTypes = {
    patients: PropTypes.array.isRequired,
    getPatients: PropTypes.func.isRequired,
  };

  countrySelect = (Nationality) => {
    if (Nationality != null) {
      this.setState({ patientNationality: Nationality.label });
      patientNationality = Nationality.label;
    } else {
      this.setState({ patientNationality: "" });
    }
  };

  async componentDidMount() {
    await this.props.getPatients();
    const patients = this.props.patients[0];
    console.log(patients);
    this.setState({
      patientID: patients.user,
      patientTitle: patients.title,
      patientFName: patients.fname,
      patientLName: patients.lname,
      patientPhone: patients.phone,
      patientGender: patients.gender,
      patientNationality: patients.Nationality,
      patientIdentification: patients.Identification,
      patientEmail: patients.email,
      nationOptions: true,
    });
    patientTitle = this.state.patientTitle;
    patientFName = this.state.patientFName;
    patientLName = this.state.patientLName;
    patientNationality = this.state.patientNationality;
    patientIdentification = this.state.patientIdentification;
    patientEmail = this.state.patientEmail;
  }

  onChange = (e) => {
    if (e.target.name == "patientTitle") {
      patientTitle = e.target.value;
    } else if (e.target.name == "patientFName") {
      patientFName = e.target.value;
    } else if (e.target.name == "patientLName") {
      patientLName = e.target.value;
    } else if (e.target.name == "patientIdentification") {
      patientIdentification = e.target.value;
    } else if (e.target.name == "patientEmail") {
      patientEmail = e.target.value;
    }
  };

  onChangePhone = (e) => {
    this.setState({ [e.target.name]: "94" + e.target.value });
  };

  render() {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const {
      appointmentNumber,
      appointmentDate,
      appointmentTime,
      bookedDoctorID,
      bookedDoctorFName,
      bookedDoctorLName,
      bookedDoctorImage,
      bookedDoctorSpecialization,
      bookedDoctorQualification,
      bookedChannellingFee,
      viewPatientNationality,
      nationOptions,
    } = this.state;

    return (
      <Fragment>
        <div className="box" style={{ margin: "0 auto" }}>
          <div
            className="grid-container .container-fluid form-inline span2 justify-content-center"
            style={{ domLayout: "autoHeight" }}
          >
            <div className="right-appointment-summary">
              <div className="item1 ">
                <div style={{ margin: "0 auto", marginTop: "30px" }}>
                  <div className="card" style={{ width: "100%" }}>
                    <div
                      className="card-body form-inline"
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <img
                        className=".img-responsive"
                        src={
                          bookedDoctorImage == null
                            ? `${defaultImg}`
                            : `${bookedDoctorImage}`
                        }
                        style={{
                          height: "120px",
                          width: "120px",
                          borderRadius: "50%",
                          margin: "0 auto",
                        }}
                      />

                      <div style={{ padding: "20px", fontSize: "13px" }}>
                        <h6 className="card-title">
                          Dr. {`${bookedDoctorFName} ${bookedDoctorLName}`}
                        </h6>
                        <p className="card-text">
                          {bookedDoctorSpecialization}
                        </p>
                        <p className="card-text">{bookedDoctorQualification}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="item4 ">
                <div
                  style={{
                    margin: "0 auto",
                    marginTop: "30px",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    className="card"
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "13px",
                    }}
                  >
                    <div className="card-body">
                      <h6 className="card-title">Appointment Summary</h6>
                      <hr width="100%" style={{ margin: "auto" }}></hr>
                      <br></br>
                      <p className="card-text">
                        Date : {dayNames[appointmentDate.getDay()]},{" "}
                        {appointmentDate.getDate()}{" "}
                        {monthNames[appointmentDate.getMonth()]}{" "}
                        {appointmentDate.getFullYear()}
                      </p>
                      <p className="card-text">Time : {appointmentTime}</p>
                      <p className="card-text">
                        Appointment Number : {appointmentNumber}
                      </p>

                      <p className="card-text">
                        Channelling Fee : LKR {bookedChannellingFee}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*===================================================Patient Information============================================================== */}
            <div
              className="item2"
              style={{
                marginTop: "20px",
                fontSize: "13px",
                alignContent: "left",
                marginBottom: "20px",
              }}
            >
              <h4>
                <b>Patient Information </b>
              </h4>
              <hr
                style={{
                  margin: "0px",
                  maxWidth: "800px",
                  color: "#000000",
                }}
              ></hr>{" "}
              <br></br>
              <form
                id="patientInfo-wrapper"
                style={{
                  padding: "20px 20px",
                  paddingTop: "45px",
                  alignContent: "initial",
                }}
                onSubmit={(e) =>
                  this.props.handleNext(
                    e,
                    this.state.patientID,
                    patientTitle,
                    patientFName,
                    patientLName,
                    this.state.patientGender,
                    patientNationality,
                    patientIdentification,
                    patientEmail,
                    this.state.patientPhone,
                    appointmentDate,
                    appointmentTime
                  )
                }
              >
                <div className="form-group row mb-3">
                  <label
                    htmlFor="validationCustom01 validationCustom02 inputTitle"
                    className=" col-sm-2 control-label "
                  >
                    Name
                  </label>

                  <div className=" col-lg-2">
                    <select
                      id="inputTitle"
                      className="form-control form-control-sm"
                      name="patientTitle"
                      onChange={this.onChange}
                      disabled={this.state.patientTitle == "-" ? false : true}
                      required
                    >
                      <option value="" disabled selected>
                        Title
                      </option>
                      <option
                        value="Mr"
                        selected={
                          this.state.patientTitle == "Mr" ? true : false
                        }
                      >
                        Mr
                      </option>
                      <option
                        value="Miss"
                        selected={
                          this.state.patientTitle == "Miss" ? true : false
                        }
                      >
                        Miss
                      </option>
                      <option
                        value="Mrs"
                        selected={
                          this.state.patientTitle == "Mrs" ? true : false
                        }
                      >
                        Mrs
                      </option>
                      <option
                        value="Ms"
                        selected={
                          this.state.patientTitle == "Ms" ? true : false
                        }
                      >
                        Ms
                      </option>
                    </select>
                  </div>
                  <div className="col-lg-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="validationCustom01"
                      placeholder="First name"
                      name="patientFName"
                      defaultValue={this.state.patientFName}
                      onChange={this.onChange}
                      required
                      disabled={this.state.patientFName == "" ? false : true}
                    />
                  </div>
                  <div className="col-lg-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="validationCustom02"
                      placeholder="Last name"
                      name="patientLName"
                      defaultValue={this.state.patientLName}
                      onChange={this.onChange}
                      required
                      disabled={this.state.patientLName == "" ? false : true}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    htmlFor="phoneNumber"
                    className="col-sm-2 control-label"
                    style={{ paddingBottom: "20px" }}
                  >
                    Phone
                  </label>

                  <div className="input-group input-group-sm col-sm-10">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      id="phoneNumber"
                      style={{ maxWidth: "100%" }}
                      placeholder=""
                      name="patientPhone"
                      defaultValue={this.state.patientPhone}
                      onChange={this.onChangePhone}
                      required
                    />
                  </div>
                </div>

                <div className="form-group row mb-3 ">
                  <label htmlFor="country" className="col-sm-2 control-label">
                    Nationality
                  </label>
                  <div className="col-sm-10 ">
                    {nationOptions && (
                      <DropDownOptions
                        patientCountrySelect={this.countrySelect}
                        patientCountry={this.state.patientNationality}
                        viewPatientNationality={viewPatientNationality}
                      />
                    )}
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label
                    htmlFor="inputEmail3"
                    className="col-sm-2 control-label"
                  >
                    NIC/Passport No.
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="inputEmail3"
                      style={{ width: "100%" }}
                      name="patientIdentification"
                      defaultValue={this.state.patientIdentification}
                      onChange={this.onChange}
                      disabled={
                        this.state.patientIdentification == "" ? false : true
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label
                    htmlFor="inputEmail3"
                    className="col-sm-2 control-label"
                  >
                    Email
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      id="inputEmail3"
                      name="patientEmail"
                      value={this.state.patientEmail}
                      onChange={this.onChange}
                      style={{ width: "100%" }}
                      disabled={this.state.patientEmail == "" ? false : true}
                      required
                    />
                  </div>
                </div>

                <div className="panel-footer row patient-info-buttons">
                  <div className="col-xs-6 text-left">
                    <div className="previous">{this.props.backButton}</div>
                  </div>
                  <div className="col-xs-6 text-right patient-info-submit">
                    <div className="next">
                      <button
                        type="submit"
                        className={`${
                          this.props.activeStep === this.props.steps.length - 1
                            ? "btn btn-primary btn-sm info-submit"
                            : "btn btn-primary btn-sm book-btn"
                        }`}
                      >
                        {this.props.activeStep === this.props.steps.length - 1
                          ? "Submit"
                          : "Book"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  patients: state.patients.patients,
});

export default connect(mapStateToProps, { getPatients })(BookingPatientDetails);
