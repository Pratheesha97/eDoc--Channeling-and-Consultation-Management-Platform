import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";

import { connect } from "react-redux";

import PropTypes from "prop-types";

export class Alerts extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, alert, message } = this.props;
    if (error !== prevProps.error) {
      console.log("error", error);

      if (error.msg.Identification || error.msg.doctorIdentification)
        alert.error(`A user with this NIC/Passport Number already exists`);

      if (error.msg.Specialization)
        alert.error(`Specialization may not be blank`);

      if (error.msg.doctorNationality)
        alert.error(`Nationality may not be blank`);

      if (error.msg.name) alert.error(`Name: ${error.msg.name.join()}`); //error.msg.name is an array. join() converts it into a string (joins into one string).

      if (error.msg.email) {
        if (
          error.msg.email.join() ==
          "user with this email address already exists."
        )
          alert.error(`Email: ${error.msg.email.join()}`);
      }

      if (error.msg.patientImage)
        alert.error(`${error.msg.patientImage.join()}`);
      if (error.msg.sImage) alert.error(`${error.msg.sImage.join()}`);
      if (error.msg.doctorImage) alert.error(`${error.msg.doctorImage.join()}`);

      if (error.msg.message) alert.error(`Message: ${error.msg.msg.join()}`);

      if (error.msg.non_field_errors)
        alert.error(error.msg.non_field_errors.join()); //Login fail error.
    }

    if (message !== prevProps.message) {
      console.log("message", message);
      if (message.updatePatient) alert.success(message.updatePatient);
      if (message.updateDoctor) alert.success(message.updateDoctor);
      if (message.updateStaff) alert.success(message.updateStaff);
      if (message.updateDoctorNoToken)
        alert.success(message.updateDoctorNoToken);
      if (message.updatePatientNoToken)
        alert.success(message.updatePatientNoToken);
      if (message.addPrescription) alert.success(message.addPrescription);
      if (message.addTreatmentPlan) alert.success(message.addTreatmentPlan);
      if (message.updateTreatmentPlan)
        alert.success(message.updateTreatmentPlan);
      if (message.passwordNotMatch) alert.error(message.passwordNotMatch);
    }
  }

  render() {
    return <Fragment />;
  }
}

const mapStateToProps = (state) => ({
  error: state.errors,
  message: state.messages,
});

export default connect(mapStateToProps)(withAlert()(Alerts));
