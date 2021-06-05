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
import { getTreatmentPlansNoToken } from "../../actions/treatmentPlans";
import { getPrescriptionsNoToken } from "../../actions/prescriptions";
import { getPatientsNoToken } from "../../actions/patients";
import { getDoctorsNoToken } from "../../actions/doctors";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import NoShowAppoints from "./NoShowAppoints";
import PrintPreview from "../doctorMode/PrintPreview";

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
var treatmentPlanInfo;
var prescriptionInfo;

var treatRefID;
var treatDate;
var treatPID;
var treatName;
var treatAge;
var treatSex;
var treatHistory;
var treatDocName;
var treatDocQualify;
var treatDocSpec;

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
      appointmentInfoDisplay: [],
    };
  }

  static propTypes = {
    updateAppointmentNoToken: PropTypes.func.isRequired,
    appointments: PropTypes.array.isRequired,
    patients: PropTypes.array.isRequired,
    doctors: PropTypes.array.isRequired,
    treatmentPlans: PropTypes.array.isRequired,
    prescriptions: PropTypes.array.isRequired,
  };

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this._isMounted && (await this.props.getAppointmentsNoToken());
      this._isMounted && (await this.props.getPatientsNoToken());
      this._isMounted && (await this.props.getDoctorsNoToken());
      this._isMounted && (await this.props.getTreatmentPlansNoToken());
      this._isMounted && (await this.props.getPrescriptionsNoToken());

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
      treatmentPlanInfo = this.props.treatmentPlans;
      prescriptionInfo = this.props.prescriptions;

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

      function findCorrespondDInfo(doctorID, returnAttr) {
        for (let m = 0; m < doctorInfo.length; m++) {
          if (doctorInfo[m].user == doctorID) {
            const dName =
              "Dr. " +
              doctorInfo[m].doctorFName +
              " " +
              doctorInfo[m].doctorLName;
            const qualify = doctorInfo[m].Qualifications;
            const specialty = doctorInfo[m].Specialization;

            if (returnAttr == "Name") {
              return dName;
            } else if (returnAttr == "Qualifications") {
              return qualify;
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
      for (let i = 0; i < appointmentInfo.length; i++) {
        if (appointmentInfo[i].status == "COMPLETED") {
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
            appointmentInfo[i].ChannellingFee,
            <span style={{ color: "green" }}> SUCCESSFUL </span>,
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
                    findCorrespondDInfo(appointmentInfo[i].doctorID, "Name"),
                    findCorrespondDInfo(
                      appointmentInfo[i].doctorID,
                      "Qualifications"
                    ),
                    findCorrespondDInfo(
                      appointmentInfo[i].doctorID,
                      "Specialization"
                    )
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
    }
  }

  componentWillUnmount() {
    appointmentInfoDisplay = [];
    prescripRows = [];
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

  showSummary = (
    refID,
    date,
    patientId,
    name,
    age,
    sex,
    history,
    docName,
    docQualify,
    docSpec
  ) => {
    treatRefID = refID;
    treatDate = date;
    treatPID = patientId;
    treatName = name;
    treatAge = age;
    treatSex = sex;
    treatHistory = history;
    treatDocName = docName;
    treatDocQualify = docQualify;
    treatDocSpec = docSpec;

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
      { label: "Amount (LKR)", options: { filter: true, sort: false } },
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
            width: "1200px",
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
        <NoShowAppoints />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  appointments: state.appointments.appointments,
  patients: state.patients.patients,
  doctors: state.doctors.doctors,
  treatmentPlans: state.treatmentPlans.treatmentPlans,
  prescriptions: state.prescriptions.prescriptions,
});

export default connect(mapStateToProps, {
  updateAppointmentNoToken,
  getPatientsNoToken,
  getAppointmentsNoToken,
  getDoctorsNoToken,
  getTreatmentPlansNoToken,
  getPrescriptionsNoToken,
})(CompletedAppointments);
