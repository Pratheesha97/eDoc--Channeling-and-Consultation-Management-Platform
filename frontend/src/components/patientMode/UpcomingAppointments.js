import React, { Component, Fragment } from "react";
import "./css/patientMode.css";
import profilePictureMale from "../doctorMode/images/doctorImages/profilePictureMale.jpg";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  updateAppointmentNoToken,
  getAppointmentsNoToken,
} from "../../actions/appointments";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { withAlert } from "react-alert";
import { compose } from "redux";

var pendingAppointmentsList = [];
var upcomingCount = 0;

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/media/doctor_profile_images/Default.png";

export class UpcomingAppointments extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      pendingAppointmentsList: [],
      patientID: this.props.auth.user.id,
      patientName: `${this.props.auth.user.first_name} ${this.props.auth.user.last_name}`,
    };
  }

  fetchPendingAppointments = async () => {
    this._isMounted && (await this.props.getAppointmentsNoToken());
    const appointments = this.props.appointments;
    pendingAppointmentsList = [];
    upcomingCount = 0;
    for (let i = 0; i < appointments.length; i++) {
      if (
        appointments[i].patientID == this.state.patientID &&
        appointments[i].status == "PENDING"
      ) {
        this._isMounted &&
          (await axios
            .get("/api/doctorNonAuth/" + appointments[i].doctorID)
            .then((res2) => {
              const doctorInfo = res2.data;
              const pendingAppointmentsObject = {
                ReferenceID: appointments[i].ReferenceID,
                PatientName: this.state.patientName,
                doctorImage: doctorInfo.doctorImage,
                doctorName: `${doctorInfo.doctorFName} ${doctorInfo.doctorLName}`,
                doctorSpecialty: doctorInfo.Specialization,
                appointmentCreated: new Date(appointments[i].created_at),
                appointmentDate: new Date(appointments[i].date),
                appointmentTime: appointments[i].time,
                appointmentNumber: appointments[i].AppointmentNo,
                channellingFee: appointments[i].ChannellingFee,
              };

              pendingAppointmentsList.unshift(pendingAppointmentsObject);
              upcomingCount += 1;
            }));
      }
    }
    this._isMounted &&
      this.setState({
        pendingAppointmentsList: pendingAppointmentsList,
      });
  };

  static propTypes = {
    updateAppointmentNoToken: PropTypes.func.isRequired,
    appointments: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this._isMounted && this.fetchPendingAppointments();
    }
  }

  componentWillUnmount() {
    pendingAppointmentsList = [];
    upcomingCount = 0;
    this._isMounted = false;
  }

  confirmationAlert = (RefID) => {
    const alert = this.props.alert;
    confirmAlert({
      title: "Appointment Cancellation!",
      message: "Are you sure you want to cancel this Appointment? ",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            let cancel = new FormData();
            cancel.append("status", "CANCELLED");
            this._isMounted &&
              (await this.props.updateAppointmentNoToken(RefID, cancel));
            this.componentDidMount();
            alert.success("Appointment has been Cancelled Successfully!");
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
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

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const hours = [
      "12",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
    ];

    return (
      <Fragment>
        {/*=========================================================== No. of Pending Appointments =============================================== */}
        <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
          <div className="card text-center number-pending-appointment-card">
            <div
              className="card-body"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              You have <span style={{ color: "red" }}>{upcomingCount}</span>{" "}
              Upcoming Appointments
            </div>
          </div>
        </div>
        {/*=========================================================== Pending Appointment Card =============================================== */}
        <div className="mb-5">
          {this.state.pendingAppointmentsList.map(
            (pendingAppointmentsList, index) => {
              return (
                <div key={index} className="mb-5">
                  <div className="patient-detail-label-div">
                    <div className="card text-right rounded-top patient-detail-label">
                      Reference ID: {pendingAppointmentsList.ReferenceID}{" "}
                      <br></br>
                      Patient Name: {pendingAppointmentsList.PatientName}{" "}
                    </div>
                  </div>
                  <div className="card text-center pending-appointment-card">
                    <div className="card-header text-left">
                      <h5>
                        <img
                          className=".img-responsive"
                          src={
                            pendingAppointmentsList.doctorImage == null
                              ? `${defaultImg}`
                              : `${pendingAppointmentsList.doctorImage}`
                          }
                          style={{
                            height: "50px",
                            width: "50px",
                            borderRadius: "50%",
                            margin: "0 auto",
                          }}
                        />
                        <b style={{ paddingLeft: "8px" }}>
                          {" "}
                          Dr. {pendingAppointmentsList.doctorName} -{" "}
                          {pendingAppointmentsList.doctorSpecialty}{" "}
                        </b>
                      </h5>
                      <h6
                        className="text-right"
                        style={{ fontSize: "11px", color: "#3f51b5" }}
                      >
                        Appointment created:{" "}
                        {
                          dayNames[
                            pendingAppointmentsList.appointmentCreated.getDay()
                          ]
                        }
                        ,{" "}
                        {pendingAppointmentsList.appointmentCreated.getDate() <
                        10
                          ? `0${pendingAppointmentsList.appointmentCreated.getDate()}`
                          : pendingAppointmentsList.appointmentCreated.getDate()}{" "}
                        {
                          monthNames[
                            pendingAppointmentsList.appointmentCreated.getMonth()
                          ]
                        }{" "}
                        {pendingAppointmentsList.appointmentCreated.getFullYear()}{" "}
                        {
                          hours[
                            pendingAppointmentsList.appointmentCreated.getHours()
                          ]
                        }
                        .
                        {pendingAppointmentsList.appointmentCreated.getMinutes() <
                        10
                          ? `0${pendingAppointmentsList.appointmentCreated.getMinutes()}`
                          : pendingAppointmentsList.appointmentCreated.getMinutes()}
                        {pendingAppointmentsList.appointmentCreated.getHours() <
                        12
                          ? "AM"
                          : "PM"}
                      </h6>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="form-row pending-appointment-card-text">
                          <div className="col">
                            <p className="card-text ">
                              <b>Date:</b> <br></br>{" "}
                              {
                                dayNames[
                                  pendingAppointmentsList.appointmentDate.getDay()
                                ]
                              }
                              ,{" "}
                              {pendingAppointmentsList.appointmentDate.getDate() <
                              10
                                ? `0${pendingAppointmentsList.appointmentDate.getDate()}`
                                : pendingAppointmentsList.appointmentDate.getDate()}{" "}
                              {
                                monthNames[
                                  pendingAppointmentsList.appointmentDate.getMonth()
                                ]
                              }{" "}
                              {pendingAppointmentsList.appointmentDate.getFullYear()}
                            </p>
                          </div>
                          <div className="col">
                            <p className="card-text">
                              <b>Time: </b>
                              <br></br>{" "}
                              {pendingAppointmentsList.appointmentTime}
                            </p>
                          </div>
                          <div className="col">
                            <p className="card-text">
                              <b>Appointment Number: </b>
                              <br></br>
                              {pendingAppointmentsList.appointmentNumber}
                            </p>
                          </div>
                          <div className="col">
                            <p className="card-text">
                              <b>Channelling Fee: </b>
                              <br></br>LKR{" "}
                              {pendingAppointmentsList.channellingFee}
                            </p>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="card-footer text-muted changeDates-cancel-buttons">
                      <div className="form-row">
                        <div className="col">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            style={{
                              width: "160px",
                              marginBottom: "3px",
                              marginTop: "3px",
                            }}
                            onClick={() =>
                              this.confirmationAlert(
                                pendingAppointmentsList.ReferenceID
                              )
                            }
                          >
                            ✖ Cancel Appointment
                          </button>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
        {/*===================================================================================================================================== */}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  appointments: state.appointments.appointments,
});

export default compose(
  withAlert(),
  connect(mapStateToProps, {
    updateAppointmentNoToken,
    getAppointmentsNoToken,
  })
)(UpcomingAppointments);
