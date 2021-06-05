import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import NewAppointment from "./NewAppointment";
import "./css/patientMode.css";
import BookingPatientDetails from "./BookingPatientDetails";
import successfulTick from "./images/successfulTick.png";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updatePatient } from "../../actions/patients";
import {
  addAppointmentNoToken,
  getAppointmentsNoToken,
} from "../../actions/appointments";
import axios from "axios";

var ErrorsFound;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

var appointments;

function BookAppointment(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [ReferenceID, setReferenceID] = useState();
  const [status, setStatus] = useState("PENDING");
  const [appointmentNumber, setAppointmentNumber] = useState();
  const [appointmentDate, setAppointmentDate] = useState();
  const [appointmentTime, setAppointmentTime] = useState();

  const [bookedDoctorID, setBookedDoctorID] = useState();
  const [bookedDoctorFName, setBookedDoctorFName] = useState();
  const [bookedDoctorLName, setBookedDoctorLName] = useState();
  const [bookedDoctorImage, setBookedDoctorImage] = useState();
  const [bookedDoctorSpecialization, setBookedDoctorSpecialization] =
    useState();
  const [bookedDoctorQualification, setBookedDoctorQualification] = useState();
  const [bookedChannellingFee, setBookedChannellingFee] = useState();
  const [bookedPatientID, setBookedPatientID] = useState();
  const [bookedPatientTitle, setBookedPatientTitle] = useState();
  const [bookedPatientFName, setBookedPatientFName] = useState();
  const [bookedPatientLName, setBookedPatientLName] = useState();
  const [bookedPatientNationality, setBookedPatientNationality] = useState();
  const [bookedPatientIdentification, setBookedPatientIdentification] =
    useState();
  const [bookedPatientEmail, setBookedPatientEmail] = useState();
  const [bookedPatientPhone, setBookedPatientPhone] = useState();

  useEffect(async () => {
    let isMounted = true;
    if (isMounted) {
      isMounted &&
        axios.get("/api/appointmentNonAuth").then((res) => {
          appointments = res.data;

          var refIDCompare = 0;
          var countRefID;
          for (let i = 0; i < appointments.length; i++) {
            if (
              parseInt(appointments[i].ReferenceID.substring(1)) > refIDCompare
            ) {
              refIDCompare = parseInt(appointments[i].ReferenceID.substring(1));
            }
          }
          if (appointments[appointments.length - 1] != undefined) {
            countRefID = refIDCompare + 1;
            if (countRefID >= 100) {
              isMounted && setReferenceID("A00" + countRefID.toString());
            } else if (countRefID >= 10) {
              isMounted && setReferenceID("A000" + countRefID.toString());
            } else {
              isMounted && setReferenceID("A0000" + countRefID.toString());
            }
          } else {
            isMounted && setReferenceID("A00001");
          }
        });
    }
    return () => {
      isMounted = false;
    };
  });

  const handleNextBook = (
    appointDateTimeObjectArray,
    appointDate,
    appointTime,
    DocID,
    DocFName,
    DocLName,
    DocImg,
    DocSpec,
    DocQualify,
    DocFee
  ) => {
    var activeAppointmentCount = 0;

    for (let j = 0; j < appointDateTimeObjectArray.length; j++) {
      if (appointDateTimeObjectArray[j][DocID] != undefined) {
        var objPending = {};
        var objCANCELLED = {};
        var objCOMPLETED = {};
        objPending = {
          [DocID]: ["PENDING", appointDate, appointTime],
        };
        objCANCELLED = {
          [DocID]: ["CANCELLED", appointDate, appointTime],
        };
        objCOMPLETED = {
          [DocID]: ["COMPLETED", appointDate, appointTime],
        };
        appointDateTimeObjectArray[j][DocID][1] = new Date(
          appointDateTimeObjectArray[j][DocID][1].setHours(0, 0, 0, 0)
        );
        objPending[DocID][1] = new Date(
          objPending[DocID][1].setHours(0, 0, 0, 0)
        );
        objCANCELLED[DocID][1] = new Date(
          objCANCELLED[DocID][1].setHours(0, 0, 0, 0)
        );
        objCOMPLETED[DocID][1] = new Date(
          objCOMPLETED[DocID][1].setHours(0, 0, 0, 0)
        );

        if (
          JSON.stringify(appointDateTimeObjectArray[j]) ===
            JSON.stringify(objPending) ||
          JSON.stringify(appointDateTimeObjectArray[j]) ===
            JSON.stringify(objCANCELLED) ||
          JSON.stringify(appointDateTimeObjectArray[j]) ===
            JSON.stringify(objCOMPLETED)
        ) {
          activeAppointmentCount = activeAppointmentCount + 1;
        }
      }
    }

    setAppointmentNumber(activeAppointmentCount + 1);
    setAppointmentDate(appointDate);
    setAppointmentTime(appointTime);
    setBookedDoctorID(DocID);
    setBookedDoctorFName(DocFName);
    setBookedDoctorLName(DocLName);
    setBookedDoctorImage(DocImg);
    setBookedDoctorSpecialization(DocSpec);
    setBookedDoctorQualification(DocQualify);
    setBookedChannellingFee(DocFee);

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleNextSubmit = async (
    e,
    pID,
    pTitle,
    pFName,
    pLName,
    pGender,
    pNationality,
    pIdentify,
    pEmail,
    pPhone,
    appointDate,
    appointTime
  ) => {
    e.preventDefault();

    var SubmitSuccess = true;

    for (let m = 0; m < appointments.length; m++) {
      var tempDate = new Date(appointments[m].date);
      tempDate.setHours(0, 0, 0);
      var appointDateTemp = new Date(appointDate);
      appointDateTemp.setHours(0, 0, 0);
      if (
        appointments[m].patientID == pID &&
        tempDate.toString() == appointDateTemp.toString() &&
        appointments[m].time == appointTime &&
        appointments[m].status == "PENDING"
      ) {
        alert(
          `Error! \n\nThe following reservation conflicts with the desired reservation. \n\nPatient Name: ${pFName} ${pLName} \nDate: ${tempDate.getDate()}/${
            tempDate.getMonth() + 1
          }/${tempDate.getFullYear()} \nTime: ${
            appointments[m].time
          } \nReference ID: ${appointments[m].ReferenceID}`
        );
        SubmitSuccess = false;
      }
    }

    if (SubmitSuccess) {
      setBookedPatientID(pID);
      setBookedPatientTitle(pTitle);
      setBookedPatientFName(pFName);
      setBookedPatientLName(pLName);
      setBookedPatientNationality(pNationality);
      setBookedPatientIdentification(pIdentify);
      setBookedPatientEmail(pEmail);
      setBookedPatientPhone(pPhone);

      let patientAppointUpdate = new FormData();

      patientAppointUpdate.append("user", pID);
      patientAppointUpdate.append("title", pTitle);
      patientAppointUpdate.append("fname", pFName);
      patientAppointUpdate.append("lname", pLName);
      patientAppointUpdate.append("gender", pGender);
      patientAppointUpdate.append("Nationality", pNationality);
      patientAppointUpdate.append("Identification", pIdentify);
      patientAppointUpdate.append("email", pEmail);

      ErrorsFound = false;
      const showSuccess = false;
      await props.updatePatient(
        pID,
        patientAppointUpdate,
        showSuccess,
        ErrorsFoundMethod
      );

      let appointmentsTable = new FormData();

      appointmentsTable.append("ReferenceID", ReferenceID);
      appointmentsTable.append("date", appointmentDate);
      appointmentsTable.append("time", appointmentTime);
      appointmentsTable.append("AppointmentNo", appointmentNumber);
      appointmentsTable.append("status", status);
      appointmentsTable.append("ChannellingFee", bookedChannellingFee);
      appointmentsTable.append("doctorID", bookedDoctorID);
      appointmentsTable.append("patientID", pID);
      appointmentsTable.append("patientContactNum", pPhone);

      if (ErrorsFound == false) {
        props.addAppointmentNoToken(appointmentsTable);
      }

      SubmitButtonAction();
    }
  };

  function ErrorsFoundMethod() {
    ErrorsFound = true;
  }

  const SubmitButtonAction = () => {
    if (ErrorsFound == false) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function getSteps() {
    return ["Find your doctor", "Fill in your information"];
  }

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <NewAppointment
            handleNext={handleNextBook}
            activeStep={activeStep}
            steps={steps}
            appointmentTime={appointmentTime}
          />
        );
      case 1:
        return (
          <BookingPatientDetails
            handleNext={handleNextSubmit}
            activeStep={activeStep}
            steps={steps}
            backButton={backButton}
            appointmentNumber={appointmentNumber}
            appointmentDate={appointmentDate}
            appointmentTime={appointmentTime}
            bookedDoctorID={bookedDoctorID}
            bookedDoctorFName={bookedDoctorFName}
            bookedDoctorLName={bookedDoctorLName}
            bookedDoctorImage={bookedDoctorImage}
            bookedDoctorSpecialization={bookedDoctorSpecialization}
            bookedDoctorQualification={bookedDoctorQualification}
            bookedChannellingFee={bookedChannellingFee}
          />
        );
      default:
        return "Unknown stepIndex";
    }
  }

  const backButton = (
    <button
      type="button"
      disabled={activeStep === 0}
      onClick={handleBack}
      className="btn btn-secondary btn-sm"
      style={{ width: "100px" }}
    >
      <span className="glyphicon glyphicon-chevron-left">Back</span>
    </button>
  );

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography
              className={classes.instructions}
              component="div"
              style={{ marginTop: "40px" }}
            >
              <div
                className="card w-75"
                style={{
                  margin: "0 auto",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
              >
                <div
                  className="card-body"
                  style={{ backgroundColor: "#5cb85c" }}
                >
                  <p
                    className="card-text"
                    style={{
                      width: "100%",
                      textAlign: "center",
                      fontSize: "30px",
                      padding: "30px 0px",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <img
                      src={successfulTick}
                      height="45px"
                      width="65px"
                      style={{ paddingRight: "20px" }}
                    />
                    Your Appointment has been saved successfully!
                  </p>
                </div>
              </div>
            </Typography>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <Button onClick={handleReset}>
                Schedule another appointment
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Typography component="span" className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}

BookAppointment.propTypes = {
  updatePatient: PropTypes.func.isRequired,
  addAppointmentNoToken: PropTypes.func.isRequired,
  appointments: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  appointments: state.appointments.appointments,
});

export default connect(mapStateToProps, {
  updatePatient,
  addAppointmentNoToken,
  getAppointmentsNoToken,
})(BookAppointment);
