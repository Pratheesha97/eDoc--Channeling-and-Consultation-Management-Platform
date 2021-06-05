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

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAppointmentsNoToken } from "../../actions/appointments";
import { getPatientsNoToken } from "../../actions/patients";
import { getDoctorsNoToken } from "../../actions/doctors";

var appointmentInfoDisplay = [];
var appointmentInfo;
var patientInfo;
var doctorInfo;
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

var successfulAppointmentCount = 0;
var noShowAppointmentCount = 0;

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/media/patient_profile_images/Default.png";

class NoShowAppoints extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      appointmentInfoDisplay: [],
    };
  }

  static propTypes = {
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
        return d - c;
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
            if (returnAttr == "Name") {
              return pName;
            }
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

      appointmentInfoDisplay = [];
      for (let i = 0; i < appointmentInfo.length; i++) {
        if (appointmentInfo[i].status == "DID NOT ATTEND") {
          var tempDate = new Date(appointmentInfo[i].date);
          var showDate;
          today.setHours(0, 0, 0);
          tempDate.setHours(0, 0, 0);

          if (today.toString() == tempDate.toString()) {
            showDate = "Today";
          } else {
            showDate = `${
              monthNames[tempDate.getMonth()]
            } ${tempDate.getDate()},  ${tempDate.getFullYear()}`;
          }
          list = [
            appointmentInfo[i].ReferenceID,
            showDate,
            appointmentInfo[i].time,
            findCorrespondDInfo(appointmentInfo[i].doctorID, "Name"),
            findCorrespondDInfo(appointmentInfo[i].doctorID, "Specialization"),
            findCorrespondPInfo(appointmentInfo[i].patientID, "Name"),
            <span style={{ color: "red" }}> {appointmentInfo[i].status} </span>,
          ];
          if (list.length != 0) {
            appointmentInfoDisplay.push(list);
          }
        }
      }
      this._isMounted &&
        this.setState({
          appointmentInfoDisplay: appointmentInfoDisplay,
        });
    }
  }

  componentWillUnmount() {
    appointmentInfoDisplay = [];
    this._isMounted = false;
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
            appointmentInfo[k].status == "COMPLETED"
          ) {
            successfulAppointmentCount += 1;
          } else if (
            appointmentInfo[k].patientID == patientID &&
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
    const columns = [
      { label: "Reference ID", options: { filter: true, sort: true } },
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
      { label: "Patient Name", options: { filter: true, sort: false } },
      { label: "Status", options: { filter: false, sort: false } },
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
          {this.doctorInfoDisplayMethod(rowData[0])}
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
                    </React.Fragment>
                  </TableBody>
                </Table>
              </Box>
            </TableCell>
          </TableRow>

          {this.patientInfoDisplayMethod(rowData[0])}
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
                      <TableRow>
                        <TableCell colSpan={10}>
                          <span style={{ fontSize: "12px", color: "green" }}>
                            Total Visited Appointments: &nbsp;
                            {successfulAppointmentCount}
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={10}>
                          <span style={{ fontSize: "12px", color: "red" }}>
                            Total No-Show Appointments: &nbsp;
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
        {/*============================= No-Show Appointments table ======================================================== */}
        <div
          style={{
            width: "1200px",
            margin: "0 auto",
            paddingTop: "50px",
            position: "relative",
            zIndex: "1",
            paddingBottom: "25px",
          }}
        >
          <MUIDataTable
            title={"No-Show Appointments"}
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

export default connect(mapStateToProps, {
  getPatientsNoToken,
  getAppointmentsNoToken,
  getDoctorsNoToken,
})(NoShowAppoints);
