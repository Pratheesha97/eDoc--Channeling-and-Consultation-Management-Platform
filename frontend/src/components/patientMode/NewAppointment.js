import React, { Component, Fragment, createRef } from "react";
import "./css/patientMode.css";
import profilePictureMale from "../doctorMode/images/doctorImages/profilePictureMale.jpg";

import DropDownOptions from "./DropDownOptions";
import moment from "moment";
import axios from "axios";
import FindDoctor2 from "./images/FindDoctor2.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getWorkSchedulesNoToken } from "../../actions/workSchedules";
import { getDoctorNoToken } from "../../actions/doctors";
import { getAppointmentsNoToken } from "../../actions/appointments";

var bookDoctorNameVar = "";
var bookDoctorSpecializationVar = "";
var bookDoctorIdVar = "";
var newBookDate = new Date();
var appointDateTimeObjectArray = [];
var activeAppointmentCountOutput = 0;
var activeAppointmentCount = 0;
var responseOne;
var count = 0;

var noAvailableDoctors = 0;
var noScheduleDates = 0;

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/media/doctor_profile_images/Default.png";

class NewAppointment extends Component {
  scrollDiv = createRef();
  constructor(props) {
    super(props);

    this.state = {
      viewDoctorNameSuggests: true,
      viewSpecializationSuggests: true,
      viewDoctorCards: false,
      viewDefaultPage: true,
      bookDoctorId: "",
      bookDoctorFName: "",
      bookDoctorLName: "",
      bookDocName: "",
      bookDoctorImage: "",
      bookDoctorSpecialization: "",
      bookDoctorSpec: "",
      bookDoctorQualification: "",
      bookDate: new Date(),
      workSchedule: [],
      appointment: [],
      appointmentNum: 0,

      bookChannellingFee: "",
      showSearchResults: false,
    };
  }

  static propTypes = {
    doctors: PropTypes.object.isRequired,
    appointments: PropTypes.array.isRequired,
    workSchedules: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
  };

  componentWillUnmount() {
    this.setState({
      viewDoctorNameSuggests: false,
      viewSpecializationSuggests: false,
    });
  }

  bookDoctorName = (doctor, event) => {
    if (doctor != null) {
      bookDoctorIdVar = doctor.doctorId;
      bookDoctorNameVar = doctor.label.substring(4);
      this.setState({
        bookDoctorId: doctor.doctorId,
        bookDocName: doctor.label,
        bookDoctorSpecialization: doctor.specialization,
      });
    } else {
      this.setState({
        bookDoctorId: "",
        bookDocName: "",
        bookDoctorSpecialization: "",
      });
    }
  };

  bookDoctorSpecialization = (specialization) => {
    if (specialization != null) {
      bookDoctorSpecializationVar = specialization;
      this.setState({
        bookDoctorSpecialization: specialization.label,
      });
    } else {
      bookDoctorSpecializationVar = "";
      this.setState({
        bookDoctorSpecialization: "",
      });
    }
  };

  onChange = (e) => {
    newBookDate = new Date(e.target.value);
  };

  searchButtonOnClick = async (e) => {
    e.preventDefault();
    var workScheduleList = [];
    var appointmentList = [];

    this.setState({ viewDoctorCards: false });
    await this.props.getDoctorNoToken(this.state.bookDoctorId);

    responseOne = this.props.doctors;
    const responseTwo = this.props.workSchedules;
    appointmentList = this.props.appointments;

    while (workScheduleList.length > 0) {
      workScheduleList.splice(0, 1);
    }

    for (let i = 0; i < responseTwo.length; i++) {
      if (responseTwo[i].doctorID == this.state.bookDoctorId) {
        workScheduleList.push(responseTwo[i]);
      }
    }

    appointDateTimeObjectArray = [];

    for (let m = 0; m < appointmentList.length; m++) {
      var changeDateFormat = new Date(appointmentList[m].date);
      var obj = {
        [appointmentList[m].doctorID]: [
          appointmentList[m].status,
          changeDateFormat,
          appointmentList[m].time,
        ],
      };
      appointDateTimeObjectArray.push(obj);
    }

    await this.setState({
      bookDoctorImage: responseOne.doctorImage,
      bookDoctorFName: responseOne.doctorFName,
      bookDoctorLName: responseOne.doctorLName,
      bookDoctorSpec: responseOne.Specialization,
      bookDoctorQualification: responseOne.Qualifications,
      bookChannellingFee: responseOne.chargePerSession,
      workSchedule: workScheduleList,
      appointment: appointmentList,
      bookDate: newBookDate,
    });

    if (
      ((this.state.bookDoctorFName || this.state.bookDoctorLName) &&
        this.state.bookDate) ||
      ((this.state.bookDoctorFName || this.state.bookDoctorLName) &&
        this.state.bookDate &&
        this.state.bookDoctorSpecialization != "")
    ) {
      this.setState({
        showSearchResults: true,
        viewDoctorCards: false,
        viewDefaultPage: false,
      });
    } else if (
      this.state.bookDoctorSpecialization != "" &&
      this.state.bookDate &&
      this.state.bookDoctorId == ""
    ) {
      this.setState({
        viewDoctorCards: true,
        showSearchResults: false,
        viewDefaultPage: false,
      });
    } else if (
      this.state.bookDate &&
      this.state.bookDoctorSpecialization == "" &&
      this.state.bookDoctorId == ""
    ) {
      this.setState({
        viewDoctorCards: false,
        showSearchResults: false,
        viewDefaultPage: true,
      });
    }
  };

  doctorSearchButton = async (docID, docFName, docLName, docSpecial, e) => {
    await this.bookDoctorName(
      {
        doctorId: `${docID}`,
        label: `Dr. ${docFName} ${docLName}`,
        specialization: `${docSpecial}`,
      },
      e
    );
    this.searchButtonOnClick(e);
  };

  scrollSmoothHandler = () => {
    this.scrollDiv.current.scrollIntoView({ behavior: "smooth" });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bookDoctorId == this.state.bookDoctorId) {
      if (
        this.state.showSearchResults == true &&
        this.scrollDiv.current != null
      ) {
        this.scrollSmoothHandler();
      }
    }
  }

  async componentDidMount() {
    await this.props.getAppointmentsNoToken();
    await this.props.getWorkSchedulesNoToken();

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;

    if (document.getElementById("dateOfAppointment") != null) {
      document.getElementById("dateOfAppointment").value = today;
    }
  }

  activeAppointmentsHandler = (
    bookDoctorId,
    ShowDates,
    WorkScheduletime,
    activeAppointmentCount,
    returnDiv
  ) => {
    for (let j = 0; j < appointDateTimeObjectArray.length; j++) {
      if (appointDateTimeObjectArray[j][bookDoctorId] != undefined) {
        var objPending = {};

        objPending = {
          [bookDoctorId]: ["PENDING", ShowDates, WorkScheduletime],
        };

        appointDateTimeObjectArray[j][bookDoctorId][1] = new Date(
          appointDateTimeObjectArray[j][bookDoctorId][1].setHours(0, 0, 0, 0)
        );
        objPending[bookDoctorId][1] = new Date(
          objPending[bookDoctorId][1].setHours(0, 0, 0, 0)
        );

        if (
          JSON.stringify(appointDateTimeObjectArray[j]) ===
          JSON.stringify(objPending)
        ) {
          activeAppointmentCount = activeAppointmentCount + 1;
        }
      }
    }

    if (returnDiv) {
      return <div>{activeAppointmentCount} </div>;
    } else {
      return activeAppointmentCount;
    }
  };

  noAvailableDoctorsCount = () => {
    noAvailableDoctors += 1;
  };

  noScheduleDatesCount = () => {
    noScheduleDates += 1;
  };

  render() {
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

    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const dayNamesFullForm = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const hours = {
      "8.00 AM": 8,
      "9.00 AM": 9,
      "10.00 AM": 10,
      "11.00 AM": 11,
      "12.00 PM": 12,
      "1.00 PM": 13,
      "2.00 PM": 14,
      "3.00 PM": 15,
      "4.00 PM": 16,
      "5.00 PM": 17,
      "6.00 PM": 18,
      "7.00 PM": 19,
      "8.00 PM": 20,
      "9.00 PM": 21,
    };

    const {
      viewDoctorNameSuggests,
      viewSpecializationSuggests,
      viewDoctorCards,
      viewDefaultPage,
      bookDoctorId,
      bookDocName,
      bookDoctorFName,
      bookDoctorLName,
      bookDoctorImage,
      bookDoctorSpec,
      bookDoctorSpecialization,
      bookDoctorQualification,
      bookDate,
      workSchedule,
      appointment,
      bookChannellingFee,
      showSearchResults,
    } = this.state;

    var today = new Date();

    var showDates = [];
    var showDateBookDate = new Date(bookDate);
    for (let i = 2; i > -3; i--) {
      showDateBookDate = new Date(bookDate);
      showDateBookDate = new Date(
        showDateBookDate.setDate(showDateBookDate.getDate() + i)
      );
      showDates.push(showDateBookDate);
    }

    return (
      <Fragment>
        {/*=================================== Search card ============================================= */}
        <div
          style={{
            maxWidth: "880px",
            margin: "0 auto",
            paddingTop: "50px",
          }}
        >
          <div className="card">
            <div className="card-body">
              <form
                style={{
                  justifyContent: "space-around",
                  alignitems: "flex-start",
                }}
              >
                <div className="form-row">
                  <div className="col-md-3 pb-2">
                    <DropDownOptions
                      viewDoctorNameSuggests={viewDoctorNameSuggests}
                      bookDoctorName={this.bookDoctorName}
                      docIdDefault={bookDoctorId}
                      docNameDefault={`${bookDocName}`}
                      doctorSpecDefault={bookDoctorSpecializationVar}
                    />
                  </div>
                  <div className="col-md-3 pb-2">
                    <DropDownOptions
                      channelHistory={false}
                      viewSpecializationSuggests={viewSpecializationSuggests}
                      bookDoctorSpecialization={this.bookDoctorSpecialization}
                      doctorSpecDefault={bookDoctorSpecialization}
                    />
                  </div>
                  <div className="col-md-3 pb-2">
                    <input
                      name="bookDate"
                      id="dateOfAppointment"
                      type="date"
                      min={moment().format("YYYY-MM-DD")}
                      max={moment().add(30, "days").format("YYYY-MM-DD")}
                      placeholder="dd-mm-yyyy"
                      className="form-control form-control-sm"
                      step="any"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="col" style={{ textAlign: "center" }}>
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm "
                      style={{ width: "150px" }}
                      onClick={this.searchButtonOnClick}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/*============================================ Search Results ======================================================== */}
        {(() => {
          if (showSearchResults) {
            noScheduleDates = 0;
            return (
              <Fragment>
                {/* ---------------------------------------------Doctor card------------------------------------------ */}
                <div
                  className="card"
                  style={{
                    minHeight: "200px",
                    minWidth: "50%",
                    backgroundColor: "#E8E8E8",
                    borderColor: "#E8E8E8",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="card-body doctor-card"
                    style={{
                      margin: "0 auto",
                      justifyContent: "space-around",
                      alignitems: "flex-start",
                      marginTop: "15px",
                    }}
                  >
                    <img
                      className=".img-responsive"
                      src={
                        bookDoctorImage == null
                          ? `${defaultImg}`
                          : `${bookDoctorImage}`
                      }
                      style={{
                        height: "150px",
                        width: "150px",
                        borderRadius: "50%",
                        margin: "0 auto",
                      }}
                    />

                    <div
                      style={{
                        padding: "5px 25px",
                        paddingTop: "15px",
                      }}
                    >
                      <h5 className="card-title">
                        Dr. {`${bookDoctorFName} ${bookDoctorLName}`}
                      </h5>
                      <p className="card-text" style={{ fontSize: "14px" }}>
                        {bookDoctorSpec}
                      </p>
                      <p className="card-text" style={{ fontSize: "14px" }}>
                        {bookDoctorQualification}
                      </p>
                    </div>
                  </div>
                  <hr
                    className="search-results-hr"
                    style={{ margin: "auto" }}
                  ></hr>
                </div>
                {/* ---------------------------------------------Search Results cards------------------------------------------ */}

                {showDates.map((ShowDates, index2) => {
                  return (
                    <div key={index2}>
                      {workSchedule.map((WorkSchedule, index) => {
                        return ShowDates > today ||
                          (ShowDates.toDateString() == today.toDateString() &&
                            hours[WorkSchedule.time] > today.getHours()) ? (
                          <div key={index}>
                            {WorkSchedule.day ==
                            dayNamesFullForm[ShowDates.getDay()] ? (
                              <div
                                ref={
                                  ShowDates.getDate() == bookDate.getDate()
                                    ? this.scrollDiv
                                    : ""
                                }
                              >
                                {this.noScheduleDatesCount()}
                                <div
                                  className={
                                    "card search-results-card " +
                                    (ShowDates.getDate() == bookDate.getDate()
                                      ? "glowing smoothScroll"
                                      : "")
                                  }
                                >
                                  <div className="card-body search-results form-inline">
                                    <div className="card-text card-data">
                                      {monthNames[ShowDates.getMonth()]}{" "}
                                      {ShowDates.getDate()},{" "}
                                      {ShowDates.getFullYear()} <br></br>
                                      {dayNames[ShowDates.getDay()]}{" "}
                                      {WorkSchedule.time}
                                    </div>

                                    <div
                                      className="card-text card-data"
                                      style={{
                                        textAlign: "center",
                                      }}
                                    >
                                      Active
                                      <span style={{ whiteSpace: "nowrap" }}>
                                        &nbsp;Appointments:
                                      </span>
                                      <br></br>
                                      {this.activeAppointmentsHandler(
                                        bookDoctorId,
                                        ShowDates,
                                        WorkSchedule.time,
                                        activeAppointmentCount,
                                        true
                                      )}
                                    </div>
                                    <div
                                      className="card-text card-data"
                                      style={{ textAlign: "center" }}
                                    >
                                      Status: <br></br>
                                      {this.activeAppointmentsHandler(
                                        bookDoctorId,
                                        ShowDates,
                                        WorkSchedule.time,
                                        activeAppointmentCount,
                                        false
                                      ) == WorkSchedule.appointmentLimit ? (
                                        <span>Overbooked</span>
                                      ) : (
                                        <span>Available</span>
                                      )}
                                    </div>
                                    <div
                                      className="card-text card-data"
                                      style={{ textAlign: "center" }}
                                    >
                                      Channelling Fee: <br></br>
                                      LKR {bookChannellingFee}
                                    </div>
                                    <div
                                      className="book-btn-div"
                                      style={{
                                        textAlign: "center",
                                        paddingRight: "40px",
                                        paddingLeft: "40px",
                                      }}
                                    >
                                      {this.activeAppointmentsHandler(
                                        bookDoctorId,
                                        ShowDates,
                                        WorkSchedule.time,
                                        activeAppointmentCount,
                                        false
                                      ) == WorkSchedule.appointmentLimit ? (
                                        <button
                                          type="submit"
                                          className={
                                            "btn btn-primary btn-sm book-btn-disabled book-btn"
                                          }
                                          disabled
                                          aria-disabled="true"
                                        >
                                          Book
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            this.props.handleNext(
                                              appointDateTimeObjectArray,
                                              ShowDates,
                                              WorkSchedule.time,
                                              bookDoctorId,
                                              bookDoctorFName,
                                              bookDoctorLName,
                                              bookDoctorImage,
                                              bookDoctorSpec,
                                              bookDoctorQualification,
                                              bookChannellingFee
                                            )
                                          }
                                          type="submit"
                                          className={`${
                                            this.props.activeStep ===
                                            this.props.steps.length - 1
                                              ? "btn btn-primary btn-sm info-submit"
                                              : "btn btn-primary btn-sm book-btn"
                                          }`}
                                        >
                                          {this.props.activeStep ===
                                          this.props.steps.length - 1
                                            ? "Submit"
                                            : "Book"}
                                        </button>
                                      )}
                                      <div></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          <div key={index}>
                            {WorkSchedule.day ==
                            dayNamesFullForm[ShowDates.getDay()] ? (
                              <div className="card search-results-card">
                                {this.noScheduleDatesCount()}
                                <div className="card-body search-results form-inline">
                                  <div className="card-text card-data">
                                    {monthNames[ShowDates.getMonth()]}{" "}
                                    {ShowDates.getDate()},{" "}
                                    {ShowDates.getFullYear()} <br></br>{" "}
                                    {dayNames[ShowDates.getDay()]}{" "}
                                    {WorkSchedule.time}
                                  </div>
                                  <div
                                    className="card-text card-data"
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    Active
                                    <span style={{ whiteSpace: "nowrap" }}>
                                      &nbsp;Appointments:
                                    </span>
                                    <br></br>-
                                  </div>
                                  <div
                                    className="card-text card-data"
                                    style={{ textAlign: "center" }}
                                  >
                                    Status: <br></br>-
                                  </div>
                                  <div
                                    className="card-text card-data"
                                    style={{ textAlign: "center" }}
                                  >
                                    Channelling Fee: <br></br>
                                    LKR {bookChannellingFee}
                                  </div>
                                  <div
                                    className="book-btn-div"
                                    style={{
                                      textAlign: "center",
                                      paddingRight: "40px",
                                      paddingLeft: "40px",
                                    }}
                                  >
                                    <button
                                      type="submit"
                                      className={
                                        "btn btn-primary btn-sm book-btn-disabled book-btn"
                                      }
                                      disabled
                                      aria-disabled="true"
                                    >
                                      Book
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                {noScheduleDates == 0 ? (
                  <h2
                    className="text-center mt-5 mb-5"
                    style={{ color: "gray" }}
                  >
                    No Dates Available...
                  </h2>
                ) : (
                  ""
                )}
              </Fragment>
            );
          } else if (viewDoctorCards == true) {
            noAvailableDoctors = 0;
            return (
              <Fragment>
                <div className="mt-5 text-center">
                  <div className="w-100">
                    <div
                      className="row"
                      style={{ width: "900px", margin: "0 auto" }}
                    >
                      {responseOne.map((doctorCards, index) => {
                        return doctorCards.Specialization ==
                          bookDoctorSpecializationVar.label ? (
                          <div key={index} className="col col-sm-4 mb-4">
                            {this.noAvailableDoctorsCount()}
                            <div
                              className="card"
                              style={{
                                maxWidth: "300px",
                                padding: "20px",
                              }}
                            >
                              <div className="card-block text-center">
                                <img
                                  className=".img-responsive"
                                  src={
                                    doctorCards.doctorImage == null
                                      ? `${defaultImg}`
                                      : `${doctorCards.doctorImage}`
                                  }
                                  style={{
                                    height: "120px",
                                    width: "120px",
                                    borderRadius: "50%",
                                  }}
                                />
                                <h6 className="card-title">
                                  <br></br>Dr.{" "}
                                  {`${doctorCards.doctorFName} ${doctorCards.doctorLName}`}
                                </h6>
                                <p className="card-text">
                                  <h6>{doctorCards.Specialization}</h6>
                                  <h6>{doctorCards.Qualifications} </h6>
                                </p>
                                <br></br>
                                <p className="card-text">
                                  <button
                                    type="submit"
                                    className={
                                      "btn btn-primary btn-sm book-btn"
                                    }
                                    onClick={(e) => {
                                      this.doctorSearchButton(
                                        doctorCards.user,
                                        doctorCards.doctorFName,
                                        doctorCards.doctorLName,
                                        doctorCards.Specialization,
                                        e
                                      );
                                    }}
                                  >
                                    Book
                                  </button>
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        );
                      })}
                    </div>
                  </div>

                  {bookDoctorSpecializationVar.label != undefined &&
                  noAvailableDoctors == 0 ? (
                    <h2 className="text-center" style={{ color: "gray" }}>
                      No Available Doctors...
                    </h2>
                  ) : (
                    ""
                  )}
                </div>
              </Fragment>
            );
          } else if (viewDefaultPage) {
            return (
              <Fragment>
                <div className="text-center mt-5">
                  <img
                    src={FindDoctor2}
                    className="picture-src"
                    id="FindDoctor"
                    title=""
                    style={{ height: "400px", width: "467px" }}
                  />
                </div>
              </Fragment>
            );
          }
        })()}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  doctors: state.doctors.doctors,
  appointments: state.appointments.appointments,
  workSchedules: state.workSchedules.workSchedules,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getWorkSchedulesNoToken,
  getDoctorNoToken,
  getAppointmentsNoToken,
})(NewAppointment);
