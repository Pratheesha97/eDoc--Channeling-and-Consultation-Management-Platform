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
import DateRangePickerFunction from "./DateRangePickerFunction";
import PrintPreview from "./PrintPreview";
import NoShowAppointments from "./NoShowAppointments";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getAppointmentsNoToken,
  updateAppointmentNoToken,
} from "../../actions/appointments";
import { getPatientsNoToken } from "../../actions/patients";
import { getTreatmentPlansNoToken } from "../../actions/treatmentPlans";
import { getPrescriptionsNoToken } from "../../actions/prescriptions";
import { getDoctors } from "../../actions/doctors";

var appointmentInfoDisplay = [];
var appointmentInfo;
var patientInfo;
var successfulAppointmentCount = 0;
var noShowAppointmentCount = 0;
var treatmentPlanInfo;
var prescriptionInfo;
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
var treatDocName;
var treatDocQualify;
var treatDocSpec;
var treatSex;
var treatHistory;
var treatDocID;

var presentingComplaint;
var testsToBeDone;
var medicalAdvices;
var prescripRows = [];

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/media/patient_profile_images/Default.png";

class CompletedAppointments extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      docID: this.props.auth.user.id,
      appointmentInfoDisplay: [],

      showing: false,
      SearchValue: "",
      SearchValueStartObject: {},
      SearchValueEndObject: {},
      showSummaryPage: false,

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
    treatmentPlans: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
    prescriptions: PropTypes.array.isRequired,
    doctors: PropTypes.array.isRequired,
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
    this.setState({ appointmentInfoDisplay: [] });
    this._isMounted = false;
    appointmentInfoDisplay = [];
    prescripRows = [];
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

      treatDocName = "";
      treatDocQualify = "";
      treatDocSpec = "";

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
      for (let i = 0; i < appointmentInfo.length; i++) {
        if (
          appointmentInfo[i].doctorID == this.state.docID &&
          appointmentInfo[i].status == "COMPLETED"
        ) {
          var tempDate = new Date(appointmentInfo[i].date);
          tempDate.setHours(0, 0, 0, 0);
          var showDate;
          if (
            today.toISOString().split("T")[0] ==
            tempDate.toISOString().split("T")[0]
          ) {
            showDate = "Today";
          } else {
            showDate = `${
              monthNames[tempDate.getMonth()]
            } ${tempDate.getDate()},  ${tempDate.getFullYear()}`;
          }
          list = [];
          list = [
            showDate,
            appointmentInfo[i].time,
            appointmentInfo[i].ReferenceID,
            findCorrespondPInfo(appointmentInfo[i].patientID, "Name"),
            appointmentInfo[i].ChannellingFee,
            <span style={{ color: "#008b02" }}>SUCCESSFUL</span>,

            <div>
              <button
                type="button"
                className="btn btn-sm rounded-pill summary-btn"
                data-toggle="modal"
                data-target="#SummaryModalCenter"
                onClick={() =>
                  this.showSummary(
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
                Summary
              </button>
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
        });
      await this.props.getTreatmentPlansNoToken();
      await this.props.getPrescriptionsNoToken();
      treatmentPlanInfo = this.props.treatmentPlans;
      prescriptionInfo = this.props.prescriptions;

      await this.props.getDoctors();
      const doc = this.props.doctors;
      if (doc[0] != undefined) {
        treatDocName = "Dr. " + doc[0].doctorFName + " " + doc[0].doctorLName;
        treatDocQualify = doc[0].Qualifications;
        treatDocSpec = doc[0].Specialization;
      }
    }
  }

  showSummary = (refID, date, patientId, name, age, sex, history, docID) => {
    treatRefID = refID;
    treatDate = date;
    treatPID = patientId;
    treatName = name;
    treatAge = age;
    treatSex = sex;
    treatHistory = history;
    treatDocID = docID;

    presentingComplaint = "";
    testsToBeDone = "";
    medicalAdvices = "";

    for (let t = 0; t < treatmentPlanInfo.length; t++) {
      if (treatmentPlanInfo[t].ReferenceID == treatRefID) {
        presentingComplaint = treatmentPlanInfo[t].presentingComplaint;
        testsToBeDone = treatmentPlanInfo[t].testsToBeDone;
        medicalAdvices = treatmentPlanInfo[t].medicalAdvices;
      }
    }

    prescripRows = [];
    for (let p = 0; p < prescriptionInfo.length; p++) {
      if (prescriptionInfo[p].ReferenceID == treatRefID) {
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
    this._isMounted &&
      this.setState({
        showSummaryPage: true,
      });
  };

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
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const {
      showing,
      SearchValue,
      SearchValueStartObject,
      SearchValueEndObject,
    } = this.state;
    const columns = [
      { label: "Date", options: { filter: true, sort: true } },
      { label: "Time", options: { filter: true, sort: false } },
      { label: "Reference ID", options: { filter: true, sort: false } },
      { label: "Patient Name", options: { filter: true, sort: false } },
      { label: "Amount(LKR)", options: { filter: true, sort: false } },
      { label: "Status", options: { filter: true, sort: false } },
      { label: "", options: { filter: false, sort: false } },
    ];

    const rows = this.state.appointmentInfoDisplay;

    const patientInfo = [
      {
        avatar: "2020-01-05",
        patientId: "P00006",
        patientName: "Samadhi Wijerathna",
        patientAge: 52,
        accountType: "Guest/Registered",
        noOfPastAppointments: 4,
      },
    ];

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
          {this.patientInfoDisplayMethod(rowData[2])}
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
                        <TableCell colSpan={8}>
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
        {/*============================= Completed Appointments card ======================================================== */}
        <div
          style={{
            width: "950px",
            margin: "0 auto",
            paddingTop: "50px",
            position: "relative",
            zIndex: "1",
            paddingBottom: "25px",
          }}
        >
          <MUIDataTable
            title={"Completed Appointments"}
            data={rows}
            columns={columns}
            options={options}
          />
        </div>
        {this.state.showSummaryPage}
        {this.state.showSummaryPage ? (
          <React.Fragment>
            {/*-- Summary Modal --*/}
            <div
              className="modal fade"
              id="SummaryModalCenter"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
              >
                <div className="modal-content">
                  <div
                    className="modal-header"
                    style={{ backgroundColor: "#e5c670", color: "#6e6d68" }}
                  >
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      <b>Summary</b>
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
                      treatRefID={treatRefID}
                      treatDate={treatDate}
                      treatPID={treatPID}
                      treatName={treatName}
                      treatAge={treatAge}
                      presentingComplaint={presentingComplaint}
                      testsToBeDone={testsToBeDone}
                      medicalAdvices={medicalAdvices}
                      prescripRows={prescripRows}
                      treatDocName={treatDocName}
                      treatDocQualify={treatDocQualify}
                      treatDocSpec={treatDocSpec}
                    />
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : (
          ""
        )}

        {/*============================= No-Show Appointments card ======================================================== */}
        <NoShowAppointments />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  appointments: state.appointments.appointments,
  patients: state.patients.patients,
  treatmentPlans: state.treatmentPlans.treatmentPlans,
  prescriptions: state.prescriptions.prescriptions,
  doctors: state.doctors.doctors,
});

export default connect(mapStateToProps, {
  getAppointmentsNoToken,
  getPatientsNoToken,
  getTreatmentPlansNoToken,
  getPrescriptionsNoToken,
  getDoctors,
  updateAppointmentNoToken,
})(CompletedAppointments);
