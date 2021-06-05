import React from "react";
import CustomFooter from "./CustomFooter";
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

import axios from "axios";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  updateAppointmentNoToken,
  getAppointmentsNoToken,
} from "../../actions/appointments";

import { getPatientsNoToken } from "../../actions/patients";
import { getDoctorsNoToken } from "../../actions/doctors";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { withAlert } from "react-alert";
import { compose } from "redux";

var appointmentInfoDisplay = [];
var appointmentInfo;
var patientInfo;
var doctorInfo;
var count = 0;
var totalAppointmentCountToday = 0;
var patientImage;
var doctorImage;
var patientID;
var doctorID;
var doctorName;
var doctorChannelFee;
var doctorContactNo;
var patientName;
var Age = 0;
var Sex;
var patientContact;

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

class UpcomingAppointments extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      appointmentInfoDisplay: [],
      numberOfAppointmentsToday: 0,
      showing: false,

      showVisitedPage: false,

      pInfoPatientImage: "",
      pInfoPatientID: "",
      pInfoPatientName: "",
      pInfoAge: "",
    };
  }

  static propTypes = {
    updateAppointmentNoToken: PropTypes.func.isRequired,
    appointments: PropTypes.array.isRequired,
    patients: PropTypes.array.isRequired,
    doctors: PropTypes.array.isRequired,
  };

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this._isMounted && (await this.props.getAppointmentsNoToken());
      this._isMounted && (await this.props.getPatientsNoToken());
      this._isMounted && (await this.props.getDoctorsNoToken());

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
      doctorInfo = this.props.doctors;

      appointmentInfo.sort(function (a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);
        return c - d;
      });

      function findCorrespondPInfo(patientID) {
        for (let m = 0; m < patientInfo.length; m++) {
          if (patientInfo[m].user == patientID) {
            var pName =
              patientInfo[m].title +
              " " +
              patientInfo[m].fname +
              " " +
              patientInfo[m].lname;

            return pName;
          }
        }
      }

      function findCorrespondDInfo(doctorID, returnAttr) {
        for (let m = 0; m < doctorInfo.length; m++) {
          if (doctorInfo[m].user == doctorID) {
            var dName =
              "Dr. " +
              doctorInfo[m].doctorFName +
              " " +
              doctorInfo[m].doctorLName;
            var specialty = doctorInfo[m].Specialization;
            if (returnAttr == "Name") {
              return dName;
            } else if (returnAttr == "Specialization") {
              return specialty;
            }
          }
        }
      }

      var list = [];
      var today = new Date();

      //Set Status to "DID NOT ATTEND" for the ones doctor had not marked visited
      for (let i = 0; i < appointmentInfo.length; i++) {
        var tempAppointDate = new Date(appointmentInfo[i].date);
        today.setHours(0, 0, 0, 0);
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
          appointmentInfo[i].status == "PENDING" ||
          (appointmentInfo[i].status == "CANCELLED" && tempDate >= today)
        ) {
          if (today.toString() == tempDate.toString()) {
            showDate = "Today";
            count = count + 1;
          } else {
            showDate = `${
              monthNames[tempDate.getMonth()]
            } ${tempDate.getDate()},  ${tempDate.getFullYear()}`;
          }
          list = [
            showDate,
            appointmentInfo[i].time,
            findCorrespondDInfo(appointmentInfo[i].doctorID, "Name"),
            findCorrespondDInfo(appointmentInfo[i].doctorID, "Specialization"),
            appointmentInfo[i].AppointmentNo,
            findCorrespondPInfo(appointmentInfo[i].patientID),
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
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    this.confirmationAlert(appointmentInfo[i].ReferenceID)
                  }
                >
                  −
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

  componentWillUnmount() {
    count = 0;
    appointmentInfoDisplay = [];
    this._isMounted = false;
  }

  patientInfoDisplayMethod = (refID) => {
    for (let i = 0; i < appointmentInfo.length; i++) {
      if (appointmentInfo[i].ReferenceID == refID) {
        patientID = appointmentInfo[i].patientID;

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
            patientContact = appointmentInfo[i].patientContactNum;
          }
        }
      }
    }
  };

  doctorInfoDisplayMethod = (refID) => {
    for (let i = 0; i < appointmentInfo.length; i++) {
      if (appointmentInfo[i].ReferenceID == refID) {
        doctorID = appointmentInfo[i].doctorID;
        var today = new Date();

        totalAppointmentCountToday = 0;
        for (let k = 0; k < appointmentInfo.length; k++) {
          var tempAppointDate = new Date(appointmentInfo[k].date);
          today.setHours(0, 0, 0);
          tempAppointDate.setHours(0, 0, 0);
          if (
            appointmentInfo[k].doctorID == doctorID &&
            tempAppointDate.toString() == today.toString() &&
            appointmentInfo[k].status == "PENDING"
          ) {
            totalAppointmentCountToday += 1;
          }
        }

        for (let j = 0; j < doctorInfo.length; j++) {
          if (doctorInfo[j].user == doctorID) {
            doctorImage = doctorInfo[j].doctorImage;
            doctorName =
              "Dr. " +
              doctorInfo[j].doctorFName +
              " " +
              doctorInfo[j].doctorLName;
            doctorChannelFee = doctorInfo[j].chargePerSession;
            doctorContactNo = doctorInfo[j].doctorPhone;
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
      { label: "Time", options: { filter: true, sort: false } },
      { label: "Doctor Name", options: { filter: true, sort: false } },
      { label: "Specialization", options: { filter: true, sort: false } },
      { label: "Appointment#", options: { filter: true, sort: false } },
      { label: "Patient Name", options: { filter: true, sort: false } },
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
      rowsPerPageOptions: [1, 2, 4, 5, 10, 20, 50, 100],
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
          {this.doctorInfoDisplayMethod(rowData[6])}
          <TableRow style={{ backgroundColor: "#ebf2f8" }}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
              <Box margin={1}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <Box fontWeight="fontWeightMedium">Doctor Information </Box>
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Doctor ID</TableCell>
                      <TableCell align="center">Doctor Name</TableCell>
                      <TableCell align="center">Channelling Fee</TableCell>
                      <TableCell align="center">Contact Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <React.Fragment>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <img
                            className=".img-responsive"
                            src={
                              doctorImage == null
                                ? `${defaultImg}`
                                : `${doctorImage}`
                            }
                            style={{
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
                          />
                        </TableCell>
                        <TableCell>{doctorID}</TableCell>
                        <TableCell align="center">{doctorName}</TableCell>
                        <TableCell align="center">{doctorChannelFee}</TableCell>
                        <TableCell align="center">{doctorContactNo}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={10}>
                          <span style={{ fontSize: "12px", color: "blue" }}>
                            Remaining Appointments for the day: &nbsp;
                            {totalAppointmentCountToday}
                          </span>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  </TableBody>
                </Table>
              </Box>
            </TableCell>
          </TableRow>

          {this.patientInfoDisplayMethod(rowData[6])}
          <TableRow style={{ backgroundColor: "#ebf2f8" }}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
              <Box margin={1}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <Box fontWeight="fontWeightMedium">Patient Information </Box>
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Patient ID</TableCell>
                      <TableCell align="center">Patient Name</TableCell>
                      <TableCell align="center">Sex</TableCell>
                      <TableCell align="center">Age</TableCell>
                      <TableCell align="center">Contact Number</TableCell>
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
                        <TableCell align="center">{patientContact}</TableCell>
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
        {/*============================= Pending Appointments card ======================================================== */}
        <div
          style={{
            width: "1180px",
            margin: "0 auto",
            paddingTop: "25px",
            position: "relative",
            zIndex: "1",
            paddingBottom: "25px",
          }}
        >
          <MUIDataTable
            title={"Upcoming Appointments"}
            data={rows}
            columns={columns}
            options={options}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  appointments: state.appointments.appointments,
  patients: state.patients.patients,
  doctors: state.doctors.doctors,
});

export default compose(
  withAlert(),
  connect(mapStateToProps, {
    updateAppointmentNoToken,
    getPatientsNoToken,
    getAppointmentsNoToken,
    getDoctorsNoToken,
  })
)(UpcomingAppointments);
