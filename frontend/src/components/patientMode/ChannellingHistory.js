import React, { Component, Fragment } from "react";
import "./css/patientMode.css";
import PrintPreview from "../doctorMode/PrintPreview";
import PrintPrescription from "../doctorMode/PrintPrescription";
import DropDownOptions from "./DropDownOptions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAppointmentsNoToken } from "../../actions/appointments";
import { getPatients } from "../../actions/patients";
import { getPrescriptionsNoToken } from "../../actions/prescriptions";
import { getDoctorsNoToken } from "../../actions/doctors";
import { getTreatmentPlansNoToken } from "../../actions/treatmentPlans";

var pastAppointmentsList = [];
var prescripRows = [];

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/media/doctor_profile_images/Default.png";

export class ChannellingHistory extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      pastAppointmentsList: [],
      patientID: this.props.auth.user.id,
      patientName: `${this.props.auth.user.first_name} ${this.props.auth.user.last_name}`,

      bookDoctorSpecialization: "",
    };
  }

  static propTypes = {
    appointments: PropTypes.array.isRequired,
    patients: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
    prescriptions: PropTypes.array.isRequired,
    doctors: PropTypes.array.isRequired,
    treatmentPlans: PropTypes.array.isRequired,
  };

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this._isMounted && (await this.fetchPastAppointments());
    }
  }

  bookDoctorSpecialization = (specialization) => {
    if (specialization != null) {
      this.setState({
        bookDoctorSpecialization: specialization.label,
      });
    } else {
      this.setState({
        bookDoctorSpecialization: "",
      });
    }
  };

  fetchPastAppointments = async () => {
    this._isMounted && (await this.props.getAppointmentsNoToken());
    this._isMounted && (await this.props.getPatients());
    this._isMounted && (await this.props.getPrescriptionsNoToken());
    this._isMounted && (await this.props.getDoctorsNoToken());
    this._isMounted && (await this.props.getTreatmentPlansNoToken());

    const appointments = this.props.appointments;
    const prescriptionInfo = this.props.prescriptions;
    const patientInfo = this.props.patients[0];
    const doctorsInfo = this.props.doctors;
    const treatmentPlansInfo = this.props.treatmentPlans;

    var treatmentPlanInfo;
    pastAppointmentsList = [];
    var doctorInfo;

    for (let i = 0; i < appointments.length; i++) {
      if (
        appointments[i].patientID == this.state.patientID &&
        (appointments[i].status == "COMPLETED" ||
          appointments[i].status == "DID NOT ATTEND")
      ) {
        for (let j = 0; j < doctorsInfo.length; j++) {
          if (doctorsInfo[j].user == appointments[i].doctorID) {
            doctorInfo = doctorsInfo[j];
          }
        }

        if (appointments[i].status == "COMPLETED") {
          for (let q = 0; q < treatmentPlansInfo.length; q++) {
            if (
              treatmentPlansInfo[q].ReferenceID == appointments[i].ReferenceID
            ) {
              treatmentPlanInfo = treatmentPlansInfo[q];
            }
          }

          prescripRows = [];
          for (let p = 0; p < prescriptionInfo.length; p++) {
            if (
              prescriptionInfo[p].ReferenceID == appointments[i].ReferenceID
            ) {
              var row = {
                drugName: prescriptionInfo[p].DrugName,
                duration: {
                  howMany: prescriptionInfo[p].DurationCount,
                  DWM: prescriptionInfo[p].DurationType,
                },
                dosage: {
                  morn: prescriptionInfo[p].DosageMorn,
                  aft: prescriptionInfo[p].DosageAft,
                  eve: prescriptionInfo[p].DosageEve,
                  night: prescriptionInfo[p].DosageNight,
                },
                instructions: prescriptionInfo[p].Instructions,
                notes: prescriptionInfo[p].Notes,
              };

              prescripRows.push(row);
            }
          }
        }
        const pastAppointmentsObject = {
          ReferenceID: appointments[i].ReferenceID,
          PatientName: `${patientInfo.title} ${this.state.patientName}`,
          PatientAge:
            new Date().getFullYear() - new Date(patientInfo.dob).getFullYear(),
          doctorImage: doctorInfo.doctorImage,
          doctorName: `${doctorInfo.doctorFName} ${doctorInfo.doctorLName}`,
          doctorSpecialty: doctorInfo.Specialization,
          doctorQualifications: doctorInfo.Qualifications,
          appointmentDate: new Date(appointments[i].date),
          appointmentTime: appointments[i].time,
          channellingFee: appointments[i].ChannellingFee,
          status:
            appointments[i].status == "COMPLETED"
              ? "Visited"
              : "Did not Attend",

          treatDate:
            appointments[i].status == "COMPLETED"
              ? treatmentPlanInfo.treatDate
              : "",

          presentingComplaint:
            appointments[i].status == "COMPLETED"
              ? treatmentPlanInfo.presentingComplaint
              : "",
          testsToBeDone:
            appointments[i].status == "COMPLETED"
              ? treatmentPlanInfo.testsToBeDone
              : "",
          medicalAdvices:
            appointments[i].status == "COMPLETED"
              ? treatmentPlanInfo.medicalAdvices
              : "",
          prescripRows:
            appointments[i].status == "COMPLETED" ? prescripRows : "",
          didPatientVisit: appointments[i].status == "COMPLETED" ? true : false,
        };

        pastAppointmentsList.unshift(pastAppointmentsObject);
      }
    }
    this._isMounted &&
      (await this.setState({
        pastAppointmentsList: pastAppointmentsList,
      }));
  };

  componentWillUnmount() {
    pastAppointmentsList = [];
    prescripRows = [];
    this._isMounted = false;
  }

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

    var count = 0;
    return (
      <Fragment>
        {/*=============================================Search Bar========================================================= */}
        <div style={{ paddingTop: "40px" }}>
          <div
            style={{
              backgroundColor: "white",
              width: "610px",
              margin: "0 auto",
            }}
          >
            <DropDownOptions
              viewSpecializationSuggests={true}
              channelHistory={true}
              bookDoctorSpecialization={this.bookDoctorSpecialization}
              doctorSpecDefault={this.state.bookDoctorSpecialization}
            />
          </div>
        </div>

        {/*=============================================Channelling History Data cards========================================================= */}
        <div className="mb-5">
          {/*{this.state.pastAppointmentsList.length == 0 ? (
            <h2 className="text-center mt-5" style={{ color: "gray" }}>
              No Appointments found...
            </h2>
          ) : (
            ""
          )}*/}
          {this.state.pastAppointmentsList.map(
            (pastAppointmentsList, index) => {
              count += 1;
              return (
                <Fragment key={index}>
                  {this.state.bookDoctorSpecialization ==
                    pastAppointmentsList.doctorSpecialty ||
                  this.state.bookDoctorSpecialization == "" ? (
                    <Fragment>
                      {" "}
                      <div style={{ paddingTop: "40px" }}>
                        <div className="card text-center pending-appointment-card">
                          <div className="card-header text-left">
                            <h5>
                              <img
                                className=".img-responsive"
                                src={
                                  pastAppointmentsList.doctorImage == null
                                    ? `${defaultImg}`
                                    : `${pastAppointmentsList.doctorImage}`
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
                                Dr. {pastAppointmentsList.doctorName} -{" "}
                                {pastAppointmentsList.doctorSpecialty}{" "}
                              </b>
                            </h5>
                            <h6
                              className="text-right"
                              style={{ fontSize: "11px" }}
                            >
                              Reference ID: {pastAppointmentsList.ReferenceID}{" "}
                              <br></br>
                              Patient Name: {pastAppointmentsList.PatientName}
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
                                        pastAppointmentsList.appointmentDate.getDay()
                                      ]
                                    }
                                    ,{" "}
                                    {pastAppointmentsList.appointmentDate.getDate() <
                                    10
                                      ? `0${pastAppointmentsList.appointmentDate.getDate()}`
                                      : pastAppointmentsList.appointmentDate.getDate()}{" "}
                                    {
                                      monthNames[
                                        pastAppointmentsList.appointmentDate.getMonth()
                                      ]
                                    }{" "}
                                    {pastAppointmentsList.appointmentDate.getFullYear()}
                                  </p>
                                </div>
                                <div className="col">
                                  <p className="card-text">
                                    <b>Time: </b>
                                    <br></br>{" "}
                                    {pastAppointmentsList.appointmentTime}
                                  </p>
                                </div>
                                <div className="col">
                                  <p className="card-text">
                                    <b>Channelling Fee: </b>
                                    <br></br>LKR{" "}
                                    {pastAppointmentsList.channellingFee}
                                  </p>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div className="card-footer text-muted changeDates-cancel-buttons">
                            <div className="form-row">
                              <span
                                style={{
                                  marginBottom: "3px",
                                  marginTop: "3px",
                                  fontSize: "11px",
                                  paddingLeft: "0px",
                                }}
                              >
                                <b>Status: </b>
                                <span
                                  style={{
                                    color: `${
                                      pastAppointmentsList.status == "Visited"
                                        ? "#008b02"
                                        : "red"
                                    }`,
                                  }}
                                >
                                  <b>{pastAppointmentsList.status}</b>
                                </span>
                              </span>{" "}
                              <span> </span>
                              <div className="col">
                                <button
                                  type="button"
                                  className={`btn btn-primary btn-sm`}
                                  data-toggle="modal"
                                  data-target={`#PrescriptionModalCenter${count}`}
                                  style={{
                                    width: `${
                                      pastAppointmentsList.didPatientVisit
                                        ? "160px"
                                        : "180px"
                                    }`,
                                    marginBottom: "3px",
                                    marginTop: "3px",
                                  }}
                                  disabled={
                                    pastAppointmentsList.didPatientVisit
                                      ? false
                                      : true
                                  }
                                >
                                  {pastAppointmentsList.didPatientVisit
                                    ? "View Prescription"
                                    : "No Prescription Available"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="modal fade"
                        id={`PrescriptionModalCenter${count}`}
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="precriptionModalCenterTitle"
                        aria-hidden="true"
                      >
                        <div
                          className="modal-dialog modal-dialog-centered modal-lg"
                          role="document"
                        >
                          <div className="modal-content">
                            <div
                              className="modal-header"
                              style={{ backgroundColor: "#abb8c3" }}
                            >
                              <h5
                                className="modal-title"
                                id="exampleModalLongTitle"
                              >
                                <b>Prescription</b>
                              </h5>
                              <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <PrintPreview
                                treatRefID={pastAppointmentsList.ReferenceID}
                                treatDate={pastAppointmentsList.treatDate}
                                treatPID={this.state.patientID}
                                treatName={pastAppointmentsList.PatientName}
                                treatAge={pastAppointmentsList.PatientAge}
                                presentingComplaint={
                                  pastAppointmentsList.presentingComplaint
                                }
                                testsToBeDone={
                                  pastAppointmentsList.testsToBeDone
                                }
                                medicalAdvices={
                                  pastAppointmentsList.medicalAdvices
                                }
                                prescripRows={pastAppointmentsList.prescripRows}
                                treatDocName={`Dr. ${pastAppointmentsList.doctorName}`}
                                treatDocQualify={
                                  pastAppointmentsList.doctorQualifications
                                }
                                treatDocSpec={
                                  pastAppointmentsList.doctorSpecialty
                                }
                              />
                            </div>

                            <div className="modal-footer">
                              <div data-dismiss="modal">
                                <PrintPrescription
                                  treatRefID={pastAppointmentsList.ReferenceID}
                                  treatDate={pastAppointmentsList.treatDate}
                                  treatPID={this.state.patientID}
                                  treatName={pastAppointmentsList.PatientName}
                                  treatAge={pastAppointmentsList.PatientAge}
                                  presentingComplaint={
                                    pastAppointmentsList.presentingComplaint
                                  }
                                  testsToBeDone={
                                    pastAppointmentsList.testsToBeDone
                                  }
                                  medicalAdvices={
                                    pastAppointmentsList.medicalAdvices
                                  }
                                  prescripRows={
                                    pastAppointmentsList.prescripRows
                                  }
                                  treatDocName={`Dr. ${pastAppointmentsList.doctorName}`}
                                  treatDocQualify={
                                    pastAppointmentsList.doctorQualifications
                                  }
                                  treatDocSpec={
                                    pastAppointmentsList.doctorSpecialty
                                  }
                                />

                                {/*🖨️ Print Prescription*/}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  ) : null}
                </Fragment>
              );
            }
          )}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  appointments: state.appointments.appointments,
  patients: state.patients.patients,
  prescriptions: state.prescriptions.prescriptions,
  doctors: state.doctors.doctors,
  treatmentPlans: state.treatmentPlans.treatmentPlans,
});

export default connect(mapStateToProps, {
  getAppointmentsNoToken,
  getPatients,
  getPrescriptionsNoToken,
  getDoctorsNoToken,
  getTreatmentPlansNoToken,
})(ChannellingHistory);
