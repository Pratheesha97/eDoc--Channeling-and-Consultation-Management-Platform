import React from "react";
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
import { getAppointmentsNoToken } from "../../actions/appointments";
import { getPatientsNoToken } from "../../actions/patients";
import { connect } from "react-redux";
import PropTypes from "prop-types";

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

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/media/doctor_profile_images/Default.png";

class NoShowAppointments extends React.Component {
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
    };

    this.setSearchValue = this.setSearchValue.bind(this);
  }

  static propTypes = {
    appointments: PropTypes.array.isRequired,
    patients: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
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

  pageDisplayOnVisited = () => {
    this.setState({
      showVisitedPage: true,
    });
  };

  backButtonOnVisitedPage = () => {
    this.setState({
      showVisitedPage: false,
    });
  };

  componentWillUnmount() {
    count = 0;
    appointmentInfoDisplay = [];
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
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

      await this.props.getAppointmentsNoToken();
      await this.props.getPatientsNoToken();

      appointmentInfo = this.props.appointments;
      patientInfo = this.props.patients;

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
            var pAge =
              new Date().getFullYear() -
              new Date(patientInfo[m].dob).getFullYear();
            var pSex = patientInfo[m].gender;

            if (returnAttr == "Name") {
              return pName;
            } else if (returnAttr == "Age") {
              return pAge;
            } else if (returnAttr == "Sex") {
              return pSex;
            }
          }
        }
      }

      var list = [];
      var today = new Date();

      appointmentInfoDisplay = [];
      for (let i = 0; i < appointmentInfo.length; i++) {
        if (
          appointmentInfo[i].doctorID == this.state.docID &&
          appointmentInfo[i].status == "DID NOT ATTEND"
        ) {
          var tempDate = new Date(appointmentInfo[i].date);
          var showDate = `${
            monthNames[tempDate.getMonth()]
          } ${tempDate.getDate()},  ${tempDate.getFullYear()}`;

          list = [
            showDate,
            appointmentInfo[i].time,
            appointmentInfo[i].ReferenceID,
            findCorrespondPInfo(appointmentInfo[i].patientID, "Name"),
            <span style={{ color: "red" }}>DID NOT ATTEND</span>,
          ];

          appointmentInfoDisplay.push(list);
        }
      }

      this._isMounted &&
        this.setState({
          appointmentInfoDisplay: appointmentInfoDisplay,
          numberOfAppointmentsToday: count,
        });
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
    const columns = [
      {
        label: "Date",
        options: {
          filter: true,
          sort: true,
        },
      },
      { label: "Time", options: { filter: true, sort: false } },
      { label: "Reference ID", options: { filter: true, sort: false } },
      { label: "Patient Name", options: { filter: true, sort: false } },
      { label: "Status", options: { filter: true, sort: false } },
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
      rowsPerPage: 3,
      rowsPerPageOptions: [1, 2, 3, 4, 5, 10],
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
          {this.patientInfoDisplayMethod(rowData[2])}
          <TableRow style={{ backgroundColor: "#ebf2f8" }}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                        <TableCell colSpan={6}>
                          <span style={{ fontSize: "12px", color: "green" }}>
                            Visited Appointments: &nbsp;
                            {successfulAppointmentCount}
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6}>
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
        {/*============================= NoShow Appointments card ======================================================== */}
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
  auth: state.auth,
  appointments: state.appointments.appointments,
  patients: state.patients.patients,
});

export default connect(mapStateToProps, {
  getAppointmentsNoToken,
  getPatientsNoToken,
})(NoShowAppointments);
