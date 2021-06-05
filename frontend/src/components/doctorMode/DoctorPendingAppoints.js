import React from "react";
import SearchBar from "material-ui-search-bar";
import CustomFooter from "./CustomFooter";
import "./css/doctorMode.css";

import MUIDataTable from "mui-datatables";
import {
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  Box,
  Typography,
} from "@material-ui/core";

import TreatmentPlan from "./TreatmentPlan";
import { initClock } from "./TodayTimeAndDate";
import axios from "axios";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  updateAppointmentNoToken,
  getAppointmentsNoToken,
} from "../../actions/appointments";

import { getPatientsNoToken } from "../../actions/patients";

var appointmentInfoDisplay = [];
var appointmentInfo;
var patientInfo;
var count = 0;
var successfulAppointmentCount = 0;
var noShowAppointmentCount = 0;
var patientImage;
var patientID;
var patientName;
var Age = 0;
var Sex;

var treatRefID;
var treatDate;
var treatPID;
var treatName;
var treatAge;
var treatSex;
var treatHistory;
var treatDocID;

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/media/patient_profile_images/Default.png";

class DoctorPendingAppoints extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      docID: this.props.auth.user.id,
      appointmentInfoDisplay: [],
      numberOfAppointmentsToday: 0,
      showing: false,
      SearchValue: "",
      SearchValueStartObject: {},
      SearchValueEndObject: {},
      showVisitedPage: false,

      pInfoPatientImage: "",
      pInfoPatientID: "",
      pInfoPatientName: "",
      pInfoAge: "",

      appointStatusUpdate: false,
    };

    this.setSearchValue = this.setSearchValue.bind(this);
  }

  static propTypes = {
    updateAppointmentNoToken: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    appointments: PropTypes.array.isRequired,
    patients: PropTypes.array.isRequired,
  };

  setSearchValue(startDate, endDate) {
    this.setState({
      SearchValue: `from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      SearchValueStartObject: startDate,
      SearchValueEndObject: endDate,
    });
  }

  closeChild = (e) => {
    this.setState({
      showing: false,
    });
  };

  backButtonOnVisitedPage = () => {
    this.setState({
      showVisitedPage: false,
    });
    this.forceUpdate();
    this.componentDidMount();
  };

  pageDisplayOnVisited = (
    refID,
    date,
    patientId,
    name,
    age,
    sex,
    history,
    docID
  ) => {
    this._isMounted &&
      this.setState({
        showVisitedPage: true,
      });
    treatRefID = refID;
    treatDate = date;
    treatPID = patientId;
    treatName = name;
    treatAge = age;
    treatSex = sex;
    treatHistory = history;
    treatDocID = docID;
  };

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this._isMounted && initClock();
      this._isMounted && setInterval(initClock(), 1);
      this._isMounted && (this.timerID = setInterval(() => initClock(), 1000));

      this._isMounted && (await this.props.getAppointmentsNoToken());
      this._isMounted && (await this.props.getPatientsNoToken());

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

      appointmentInfo = this.props.appointments;
      patientInfo = this.props.patients;

      appointmentInfo.sort(function (a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);
        return c - d;
      });

      function findCorrespondPInfo(patientID, returnAttr) {
        for (let m = 0; m < patientInfo.length; m++) {
          if (patientInfo[m].user == patientID) {
            var pName =
              patientInfo[m].title +
              " " +
              patientInfo[m].fname +
              " " +
              patientInfo[m].lname;
            var pAge =
              new Date().getFullYear() -
              new Date(patientInfo[m].dob).getFullYear();
            var pSex = patientInfo[m].gender;
            var pHistory = patientInfo[m].patientHistory;
            if (returnAttr == "Name") {
              return pName;
            } else if (returnAttr == "Age") {
              return pAge;
            } else if (returnAttr == "Sex") {
              return pSex;
            } else if (returnAttr == "Patient History") {
              return pHistory;
            }
          }
        }
      }

      var list = [];
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = 0; i < appointmentInfo.length; i++) {
        var tempAppointDate = new Date(appointmentInfo[i].date);
        if (appointmentInfo[i].status == "PENDING" && tempAppointDate < today) {
          let form_data = new FormData();
          form_data.append("status", "DID NOT ATTEND");
          this._isMounted &&
            (await this.props.updateAppointmentNoToken(
              appointmentInfo[i].ReferenceID,
              form_data
            ));
        }
      }

      appointmentInfoDisplay = [];
      count = 0;
      for (let i = 0; i < appointmentInfo.length; i++) {
        var tempDate = new Date(appointmentInfo[i].date);
        tempDate.setHours(0, 0, 0);
        var showDate;

        if (
          appointmentInfo[i].doctorID == this.state.docID &&
          (appointmentInfo[i].status == "PENDING" ||
            (appointmentInfo[i].status == "CANCELLED" && tempDate >= today))
        ) {
          if (today.toString() == tempDate.toString()) {
            showDate = "Today";
            if (appointmentInfo[i].status == "PENDING") {
              count = count + 1;
            }
          } else {
            showDate = `${
              monthNames[tempDate.getMonth()]
            } ${tempDate.getDate()},  ${tempDate.getFullYear()}`;
          }
          list = [
            showDate,
            appointmentInfo[i].AppointmentNo,
            findCorrespondPInfo(appointmentInfo[i].patientID, "Name"),
            appointmentInfo[i].time,
            appointmentInfo[i].ReferenceID,
            <span
              style={{
                color: `${
                  appointmentInfo[i].status == "PENDING" ? "blue" : "red"
                }`,
              }}
            >
              {appointmentInfo[i].status}
            </span>,
            <div>
              {appointmentInfo[i].status == "PENDING" ? (
                <button
                  type="button"
                  className="btn btn-success btn-sm rounded-pill ml-3"
                  onClick={() =>
                    this.pageDisplayOnVisited(
                      appointmentInfo[i].ReferenceID,
                      appointmentInfo[i].date,
                      appointmentInfo[i].patientID,
                      findCorrespondPInfo(appointmentInfo[i].patientID, "Name"),
                      findCorrespondPInfo(appointmentInfo[i].patientID, "Age"),
                      findCorrespondPInfo(appointmentInfo[i].patientID, "Sex"),
                      findCorrespondPInfo(
                        appointmentInfo[i].patientID,
                        "Patient History"
                      ),
                      appointmentInfo[i].doctorID
                    )
                  }
                >
                  Visited
                </button>
              ) : (
                ""
              )}
            </div>,
          ];
          if (list.length != 0) {
            appointmentInfoDisplay.push(list);
          }
        }
      }

      this._isMounted &&
        this.setState({
          appointmentInfoDisplay: appointmentInfoDisplay,
          numberOfAppointmentsToday: count,
        });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    count = 0;
    appointmentInfoDisplay = [];
    this._isMounted = false;
  }

  componentDidUpdate(prevState, prevProps) {
    if (this.state.showVisitedPage) {
      clearInterval(this.timerID);
    } else {
      this.timerID = setInterval(() => initClock(), 1000);
    }
  }

  patientInfoDisplayMethod = (refID) => {
    for (let i = 0; i < appointmentInfo.length; i++) {
      if (appointmentInfo[i].ReferenceID == refID) {
        patientID = appointmentInfo[i].patientID;

        successfulAppointmentCount = 0;
        noShowAppointmentCount = 0;
        for (let k = 0; k < appointmentInfo.length; k++) {
          if (
            appointmentInfo[k].patientID == patientID &&
            appointmentInfo[k].doctorID == this.state.docID &&
            appointmentInfo[k].status == "COMPLETED"
          ) {
            successfulAppointmentCount += 1;
          } else if (
            appointmentInfo[k].patientID == patientID &&
            appointmentInfo[k].doctorID == this.state.docID &&
            appointmentInfo[k].status == "DID NOT ATTEND"
          ) {
            noShowAppointmentCount += 1;
          }
        }

        for (let j = 0; j < patientInfo.length; j++) {
          if (patientInfo[j].user == patientID) {
            patientImage = patientInfo[j].patientImage;
            patientName =
              patientInfo[j].title +
              " " +
              patientInfo[j].fname +
              " " +
              patientInfo[j].lname;
            Age =
              new Date().getFullYear() -
              new Date(patientInfo[j].dob).getFullYear();
            Sex = patientInfo[j].gender;
          }
        }
      }
    }
  };

  render() {
    const {
      showing,
      SearchValue,
      SearchValueStartObject,
      SearchValueEndObject,
      pInfoPatientID,
      pInfoPatientImage,
      pInfoPatientName,
      pInfoAge,
    } = this.state;

    const columns = [
      {
        label: "Date",
        options: {
          filter: true,
          sort: true,
          setCellHeaderProps: (value) => ({
            style: { align: "center" },
          }),
        },
      },
      { label: "Appointment#", options: { filter: true, sort: false } },
      { label: "Patient Name", options: { filter: true, sort: false } },
      { label: "Time", options: { filter: true, sort: false } },
      { label: "Reference ID", options: { filter: true, sort: false } },
      { label: "Status", options: { filter: false, sort: false } },
      { label: "", options: { filter: false, sort: false } },
    ];

    const rows = this.state.appointmentInfoDisplay;

    const options = {
      filterType: "dropdown",
      //responsive: "scroll",
      responsive: "standard",
      selectableRows: "none",
      expandableRows: true,
      expandableRowsHeader: false,
      expandableRowsOnClick: false,
      rowsPerPage: 10,
      rowsPerPageOptions: [1, 2, 4, 5, 10],
      customFooter: (
        count,
        page,
        rowsPerPage,
        changeRowsPerPage,
        changePage,
        textLabels
      ) => {
        return (
          <CustomFooter
            totalRows={rows.length}
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            changeRowsPerPage={changeRowsPerPage}
            changePage={changePage}
            textLabels={textLabels}
          />
        );
      },

      renderExpandableRow: (rowData) => (
        //GET ROW DATA, FETCH PATIENTID AND THEN DISPLAY PATIENT DETAILS IN EXPANDABLE ROW using (customBodyRender:)

        <React.Fragment>
          {this.patientInfoDisplayMethod(rowData[4])}
          <TableRow style={{ backgroundColor: "#ebf2f8" }}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
              <Box margin={1}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <Box fontWeight="fontWeightMedium">Patient Information </Box>
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Patient ID</TableCell>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Sex</TableCell>
                      <TableCell align="center">Age</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <React.Fragment>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <img
                            className=".img-responsive"
                            src={
                              patientImage == null
                                ? `${defaultImg}`
                                : `${patientImage}`
                            }
                            style={{
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
                          />
                        </TableCell>
                        <TableCell>{patientID}</TableCell>
                        <TableCell align="center">{patientName}</TableCell>
                        <TableCell align="center">{Sex}</TableCell>
                        <TableCell align="center">{`${Age} yrs`}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={8}>
                          <span style={{ fontSize: "12px", color: "green" }}>
                            Visited Appointments: &nbsp;
                            {successfulAppointmentCount}
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={7}>
                          <span style={{ fontSize: "12px", color: "red" }}>
                            No-Show Appointments: &nbsp;
                            {noShowAppointmentCount}
                          </span>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  </TableBody>
                </Table>
              </Box>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ),
    };

    return (
      <React.Fragment>
        {!this.state.showVisitedPage ? (
          <React.Fragment>
            {/* =============================================Calendar and Clock========================================================= */}
            <div className="pt-3">
              <div id="timedate">
                <a id="mon">January</a> &nbsp;
                <a id="d">1</a>,&nbsp;<a id="y">0</a>
                <br />
                <a id="h">12</a>: <a id="m">00</a>: <a id="s">00</a>&nbsp;
                <a id="mid">am </a>
                <p style={{ float: "right" }}>
                  you have{" "}
                  <span style={{ color: "red" }}>
                    {this.state.numberOfAppointmentsToday}
                  </span>{" "}
                  {this.state.numberOfAppointmentsToday == 1
                    ? "appointment"
                    : "appointments"}{" "}
                  today
                </p>
              </div>
            </div>
            {/*============================= Pending Appointments card ======================================================== */}
            <div
              style={{
                width: "950px",
                margin: "0 auto",
                paddingTop: "25px",
                position: "relative",
                zIndex: "1",
                paddingBottom: "25px",
              }}
            >
              <MUIDataTable
                title={"Pending Appointments"}
                data={rows}
                columns={columns}
                options={options}
              />
            </div>
            {/*-- Reschedule Modal --*/}
            <div
              className="modal fade"
              id="RescheduleModalCenter"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div
                    className="modal-header"
                    style={{ backgroundColor: "#e1ebf6", color: "#516068" }}
                  >
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      <b>Request Reschedule</b>
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
                  <div className="modal-header">
                    <h6 style={{ color: "#545454", width: "100%" }}>
                      <table className="table table-bordered table-sm">
                        <tbody>
                          <tr>
                            <td colSpan={2}>
                              <b>Patient ID: 115</b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>Ms. Samadhi Wijeratne</td>
                          </tr>
                          <tr>
                            <td>Date: Wednesday, 24 March 2021</td>
                            <td>Time: 4.00pm</td>
                          </tr>
                        </tbody>
                      </table>
                    </h6>
                  </div>
                  <div className="modal-body">
                    <h5>
                      <form>
                        <div className="row row-space">
                          <div className="col-md-12">
                            <div className="form-group ">
                              <label htmlFor="newDateFormControlInput">
                                New date
                              </label>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                id="newDateFormControlInput"
                              />
                            </div>{" "}
                          </div>{" "}
                        </div>
                        <div className="row row-space">
                          <div className="col-md-12">
                            <div className="form-group ">
                              <label htmlFor="newTimeFormControlSelect">
                                New Time
                              </label>
                              <select
                                className="form-control form-control-sm"
                                id="newTimeFormControlSelect"
                              >
                                <option>--- Select time ---</option>
                                <option>9.00 am</option>
                                <option>10.00 am</option>
                                <option>2.00 pm</option>
                                <option>4.00 pm</option>
                                <option>6.00 pm</option>
                              </select>
                            </div>{" "}
                          </div>{" "}
                        </div>
                        <div className="row row-space">
                          <div className="col-md-6">
                            <div className="form-group ">
                              <label htmlFor="newActiveAppointments">
                                Active Appointments
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="newActiveAppointments"
                                value="3"
                                disabled={true}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group ">
                              <label htmlFor="newAppointmentNumber">
                                Appointment Number
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="newAppointmentNumber"
                                value="4"
                                disabled={true}
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </h5>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="button" className="btn btn-primary btn-sm">
                      Send Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div>
              <TreatmentPlan
                backButtonOnVisitedPage={this.backButtonOnVisitedPage}
                treatRefID={treatRefID}
                treatDate={treatDate}
                treatPID={treatPID}
                treatName={treatName}
                treatAge={treatAge}
                treatSex={treatSex}
                treatHistory={treatHistory}
                treatDocID={treatDocID}
              />
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  appointments: state.appointments.appointments,
  patients: state.patients.patients,
});

export default connect(mapStateToProps, {
  updateAppointmentNoToken,
  getPatientsNoToken,
  getAppointmentsNoToken,
})(DoctorPendingAppoints);
