import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import PrescriptionTable from "./PrescriptionTable";
import PrintPrescription from "./PrintPrescription";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  deletePrescriptionNoToken,
  addPrescriptionNoToken,
} from "../../actions/prescriptions";
import {
  addTreatmentPlanNoToken,
  updateTreatmentPlanNoToken,
} from "../../actions/treatmentPlans";
import { getDoctors } from "../../actions/doctors";

import { updateAppointmentNoToken } from "../../actions/appointments";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import prescriptions from "../../reducers/prescriptions";
import { ExitToApp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

var prescriptionsTableData = "";
var emptyPrescripRows = true;
var patientHistoryObjectArray = [];

function TreatmentPlan(props) {
  const classes = useStyles();
  const [prescriptionID, setPrescriptionID] = useState("");
  const [presentingComplaint, setPresentingComplaint] = useState("");
  const [investigationResults, setInvestigationResults] = useState("");
  const [testsToBeDone, setTestsToBeDone] = useState("");
  const [medicalAdvices, setMedicalAdvices] = useState("");
  const [prescripRows, setPrescripRows] = useState();
  const [treatDocName, setTreatDocName] = useState("");
  const [treatDocQualify, setTreatDocQualify] = useState("");
  const [treatDocSpec, setTreatDocSpec] = useState("");

  const changePresentingComplaint = (event) => {
    setPresentingComplaint(event.target.value);
  };

  const changeInvestigationResults = (event) => {
    setInvestigationResults(event.target.value);
  };

  const changeTestsToBeDone = (event) => {
    setTestsToBeDone(event.target.value);
  };

  const changeMedicalAdvices = (event) => {
    setMedicalAdvices(event.target.value);
  };

  useEffect(async () => {
    let isMounted = true;
    if (isMounted) {
      isMounted &&
        (await axios
          .get(`/api/doctorNonAuth/${props.auth.user.id}`)
          .then(async (res) => {
            const doc = res.data;
            isMounted &&
              (await setTreatDocName(
                "Dr. " + doc.doctorFName + " " + doc.doctorLName
              ));
            isMounted && (await setTreatDocQualify(doc.Qualifications));
            isMounted && (await setTreatDocSpec(doc.Specialization));
          }));

      isMounted &&
        (await axios.get("/api/prescriptionNonAuth").then((res) => {
          prescriptionsTableData = res.data;
          var prescIDCompare = 0;
          var countPrescID;
          for (let i = 0; i < prescriptionsTableData.length; i++) {
            if (
              parseInt(prescriptionsTableData[i].PrescriptionID.substring(3)) >
              prescIDCompare
            ) {
              prescIDCompare = parseInt(
                prescriptionsTableData[i].PrescriptionID.substring(3)
              );
            }
          }
          if (
            prescriptionsTableData[prescriptionsTableData.length - 1] !=
            undefined
          ) {
            countPrescID = prescIDCompare + 1;
            if (countPrescID >= 100) {
              isMounted && setPrescriptionID("PID00" + countPrescID.toString());
            } else if (countPrescID >= 10) {
              isMounted &&
                setPrescriptionID("PID000" + countPrescID.toString());
            } else {
              isMounted &&
                setPrescriptionID("PID0000" + countPrescID.toString());
            }
          } else {
            isMounted && setPrescriptionID("PID00001");
          }
        }));
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const treatDate = new Date(props.treatDate);

  const displayPatientHistory = () => {
    //POPULATE PATIENT HISTORY OBJECT
    axios.get("/api/treatmentPlanNonAuth").then((response) => {
      var treatmentPlan = response.data;
      patientHistoryObjectArray = [];
      for (let n = 0; n < treatmentPlan.length; n++) {
        if (
          treatmentPlan[n].patientID == props.treatPID &&
          treatmentPlan[n].doctorID == props.treatDocID &&
          new Date(treatmentPlan[n].treatDate) < treatDate
        ) {
          var obj = {
            treatDate: treatmentPlan[n].treatDate,
            presentingComplaint: treatmentPlan[n].presentingComplaint,
            investigationResults: treatmentPlan[n].investigationResults,
          };
          patientHistoryObjectArray[patientHistoryObjectArray.length] = obj;
        }
      }
    });
  };

  const confirmationAlert = (e) => {
    confirmAlert({
      title: "Are you sure you want to save this treatment plan?",
      message: 'This Appointment will be marked as "completed"',
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            submitTreatmentPlan(e);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
      closeOnClickOutside: false,
    });
  };

  const submitTreatmentPlan = (e) => {
    var treatmentTable;
    axios.get("/api/treatmentPlanNonAuth/").then((res) => {
      treatmentTable = res.data;
      let form_data = new FormData();
      form_data.append("ReferenceID", props.treatRefID);
      form_data.append("patientID", props.treatPID);
      form_data.append("doctorID", props.treatDocID);
      form_data.append("presentingComplaint", presentingComplaint);
      form_data.append("investigationResults", investigationResults);
      form_data.append("testsToBeDone", testsToBeDone);
      form_data.append("medicalAdvices", medicalAdvices);
      form_data.append("treatDate", treatDate);

      var matchFound = false;
      for (let i = 0; i < treatmentTable.length; i++) {
        if (treatmentTable[i].ReferenceID == props.treatRefID) {
          props.updateTreatmentPlanNoToken(
            treatmentTable[i].ReferenceID,
            form_data
          );
          matchFound = true;
          break;
        }
      }

      if (matchFound == false) {
        props.addTreatmentPlanNoToken(form_data);
      }

      if (emptyPrescripRows == true) {
        let presc_data = new FormData();
        presc_data.append("PrescriptionID", prescriptionID);
        presc_data.append("ReferenceID", props.treatRefID);
        presc_data.append("DrugName", "");
        presc_data.append("DurationCount", 0);
        presc_data.append("DurationType", "Days");
        presc_data.append("DosageMorn", 0);
        presc_data.append("DosageAft", 0);
        presc_data.append("DosageEve", 0);
        presc_data.append("DosageNight", 0);
        presc_data.append("Instructions", "Not Specified");
        presc_data.append("Notes", "");

        props.addPrescriptionNoToken(presc_data);
      }
      // for (var pair of form_data.entries()) {
      //   console.log(pair[0] + ", " + pair[1]);
      // }
      let setStatus_form_data = new FormData();
      setStatus_form_data.append("status", "COMPLETED");
      props.updateAppointmentNoToken(props.treatRefID, setStatus_form_data);
    });
  };

  const submitPrescriptionTable = (e) => {
    axios.get("/api/prescriptionNonAuth").then((res) => {
      prescriptionsTableData = res.data;

      for (let i = 0; i < prescriptionsTableData.length; i++) {
        if (prescriptionsTableData[i].PrescriptionID == prescriptionID) {
          props.deletePrescriptionNoToken(prescriptionsTableData[i].ID);
        }
      }

      for (let j = 0; j < prescripRows.length; j++) {
        if (prescripRows[j].drugName != "") {
          emptyPrescripRows = false;
          let form_data = new FormData();
          form_data.append("PrescriptionID", prescriptionID);
          form_data.append("ReferenceID", props.treatRefID);
          form_data.append("DrugName", prescripRows[j].drugName);
          form_data.append("DurationCount", prescripRows[j].duration.howMany);
          form_data.append("DurationType", prescripRows[j].duration.DWM);
          form_data.append("DosageMorn", prescripRows[j].dosage.morn);
          form_data.append("DosageAft", prescripRows[j].dosage.aft);
          form_data.append("DosageEve", prescripRows[j].dosage.eve);
          form_data.append("DosageNight", prescripRows[j].dosage.night);
          form_data.append("Instructions", prescripRows[j].instructions);
          form_data.append("Notes", prescripRows[j].notes);

          props.addPrescriptionNoToken(form_data);
        }
      }
    });
  };

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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

  return (
    <React.Fragment>
      <form className={classes.root} noValidate autoComplete="off">
        <div className="pt-5 pb-5" style={{ width: "900px", margin: "0 auto" }}>
          <button
            type="button"
            className="btn btn-outline-secondary mb-2 btn-sm"
            onClick={() => {
              props.backButtonOnVisitedPage();
            }}
          >
            🡰 Back
          </button>
          <div className="card">
            <h5 className="card-header">
              Reference ID: {props.treatRefID}
              <br></br>
              <span style={{ fontSize: "11px" }}>
                <i>
                  {dayNames[treatDate.getDay()]}, {treatDate.getDate()}{" "}
                  {monthNames[treatDate.getMonth()]} {treatDate.getFullYear()}
                </i>
              </span>
            </h5>
            <div className="card-body">
              <h6 style={{ color: "#545454" }}>
                <table className="table table-bordered table-sm">
                  <tbody>
                    <tr>
                      <td colSpan={3}>
                        <b>Patient ID: {props.treatPID}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>{props.treatName}</td>
                      <td>{props.treatAge} yrs</td>
                      <td> {props.treatSex}</td>
                    </tr>
                  </tbody>
                </table>
              </h6>
            </div>

            <div className="card-body pt-0 pb-0">
              <h6 style={{ color: "#545454" }}>
                <table className="table table-bordered table-sm">
                  <tbody>
                    <tr>
                      <td colSpan={2}>
                        <b>Patient History</b>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <table className="table table-borderless">
                          <thead>
                            <tr>
                              <th scope="col">
                                <i>Signs & Symptoms</i>
                              </th>
                              <th scope="col">
                                <i>Investigations</i>
                              </th>
                            </tr>
                          </thead>
                          {displayPatientHistory()}
                          <tbody>
                            {patientHistoryObjectArray.map(
                              (objArray, index) => {
                                if (objArray != undefined) {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <b>
                                          <i>
                                            {new Date(
                                              objArray.treatDate
                                            ).getDate() < 10
                                              ? "0" +
                                                new Date(
                                                  objArray.treatDate
                                                ).getDate()
                                              : new Date(
                                                  objArray.treatDate
                                                ).getDate()}
                                            .
                                            {new Date(
                                              objArray.treatDate
                                            ).getMonth() < 9
                                              ? `0${
                                                  new Date(
                                                    objArray.treatDate
                                                  ).getMonth() + 1
                                                }`
                                              : new Date(
                                                  objArray.treatDate
                                                ).getMonth() + 1}
                                            .
                                            {new Date(
                                              objArray.treatDate
                                            ).getFullYear()}
                                            :
                                          </i>
                                        </b>
                                        <br></br>
                                        {objArray.presentingComplaint}
                                      </td>
                                      <td>
                                        <b>
                                          <i>
                                            {new Date(
                                              objArray.treatDate
                                            ).getDate() < 10
                                              ? "0" +
                                                new Date(
                                                  objArray.treatDate
                                                ).getDate()
                                              : new Date(
                                                  objArray.treatDate
                                                ).getDate()}
                                            .
                                            {new Date(
                                              objArray.treatDate
                                            ).getMonth() < 9
                                              ? `0${
                                                  new Date(
                                                    objArray.treatDate
                                                  ).getMonth() + 1
                                                }`
                                              : new Date(
                                                  objArray.treatDate
                                                ).getMonth() + 1}
                                            .
                                            {new Date(
                                              objArray.treatDate
                                            ).getFullYear()}
                                            :
                                          </i>
                                        </b>
                                        <br></br>
                                        {objArray.investigationResults}
                                      </td>
                                    </tr>
                                  );
                                }
                              }
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </h6>
            </div>

            <div className="card-body">
              <TextField
                id="filled-multiline-static"
                label="Presenting Complaint"
                multiline
                onChange={changePresentingComplaint}
                rows={3}
                defaultValue={presentingComplaint}
                variant="filled"
                style={{ width: "100%", marginLeft: "0px" }}
              />
              <TextField
                id="filled-multiline-static"
                label="Investigation Results"
                multiline
                onChange={changeInvestigationResults}
                rows={3}
                defaultValue={investigationResults}
                variant="filled"
                style={{ width: "100%", marginLeft: "0px" }}
              />
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm w-100 change-password-button"
                  data-toggle="modal"
                  data-target="#treatmentModalCenter"
                  style={{
                    backgroundColor: "#3f51b5",
                    borderColor: " #3f51b5",
                  }}
                >
                  Treatment Plan
                </button>
              </div>

              <div className="card-body" style={{ textAlign: "center" }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm ml-2 mr-2"
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    width: "200px",
                  }}
                  onClick={confirmationAlert}
                >
                  Save
                </button>
                <div
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                >
                  {console.log("treatDocName", treatDocName)}
                  {console.log("treatDocQualify", treatDocQualify)}
                  {console.log("treatDocSpec", treatDocSpec)}

                  <PrintPrescription
                    treatRefID={props.treatRefID}
                    treatDate={treatDate}
                    treatPID={props.treatPID}
                    treatName={props.treatName}
                    treatAge={props.treatAge}
                    presentingComplaint={presentingComplaint}
                    testsToBeDone={testsToBeDone}
                    medicalAdvices={medicalAdvices}
                    prescripRows={prescripRows}
                    treatDocName={treatDocName}
                    treatDocQualify={treatDocQualify}
                    treatDocSpec={treatDocSpec}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*============================================= Treatment Plan Modal ========================================= */}
        <div
          className="modal fade"
          id="treatmentModalCenter"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          data-backdrop="static"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            style={{ minWidth: "1100px" }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Treatment Plan
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
                <TextField
                  id="filled-multiline-static"
                  label={
                    <span style={{ textTransform: "initial" }}>
                      Tests to be done
                    </span>
                  }
                  multiline
                  onChange={changeTestsToBeDone}
                  rows={3}
                  defaultValue={testsToBeDone}
                  variant="filled"
                  style={{ width: "100%", marginLeft: "0px" }}
                  autoCapitalize="none"
                />
                <TextField
                  id="filled-multiline-static"
                  label="Medical Advices"
                  multiline
                  onChange={changeMedicalAdvices}
                  rows={3}
                  defaultValue={medicalAdvices}
                  variant="filled"
                  style={{ width: "100%", marginLeft: "0px" }}
                />
                <h5 className="text-center mt-3">
                  <b>
                    <u>Prescription- {prescriptionID}</u>
                  </b>
                </h5>
                {/*======================================================Prescription Table======================================== */}
                <PrescriptionTable setPrescripRows={setPrescripRows} />
                {/*=========================================================================================================== */}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary btn-sm w-25 change-password-button"
                  style={{
                    backgroundColor: "#3f51b5",
                    borderColor: " #3f51b5",
                  }}
                  onClick={submitPrescriptionTable}
                  data-dismiss="modal"
                >
                  Save Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
}

TreatmentPlan.propTypes = {
  deletePrescriptionNoToken: PropTypes.func.isRequired,
  addPrescriptionNoToken: PropTypes.func.isRequired,
  addTreatmentPlanNoToken: PropTypes.func.isRequired,
  updateTreatmentPlanNoToken: PropTypes.func.isRequired,
  updateAppointmentNoToken: PropTypes.func.isRequired,
  doctors: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  prescriptions: state.prescriptions.prescriptions,
  doctors: state.doctors.doctors,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  deletePrescriptionNoToken,
  addPrescriptionNoToken,
  addTreatmentPlanNoToken,
  updateTreatmentPlanNoToken,
  updateAppointmentNoToken,
  getDoctors,
})(TreatmentPlan);
