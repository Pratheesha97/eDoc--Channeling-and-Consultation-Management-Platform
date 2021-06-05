import React, { Component } from "react";
import ReactToPrint from "react-to-print";
import "./css/doctorMode.css";
import PrintPreview from "./PrintPreview";

class PrintPrescription extends Component {
  render() {
    return (
      <div className="print-source">
        <PrintPreview
          treatRefID={this.props.treatRefID}
          treatDate={this.props.treatDate}
          treatPID={this.props.treatPID}
          treatName={this.props.treatName}
          treatAge={this.props.treatAge}
          presentingComplaint={this.props.presentingComplaint}
          testsToBeDone={this.props.testsToBeDone}
          medicalAdvices={this.props.medicalAdvices}
          prescripRows={this.props.prescripRows}
          treatDocName={this.props.treatDocName}
          treatDocQualify={this.props.treatDocQualify}
          treatDocSpec={this.props.treatDocSpec}
        />
      </div>
    );
  }
}

class printButton extends Component {
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => (
            <button
              type="button"
              className="btn btn-dark btn-sm ml-2 mr-2"
              style={{ width: "200px" }}
            >
              🖨️ Print
            </button>
          )}
          content={() => this.componentRef}
        />

        <PrintPrescription
          ref={(el) => (this.componentRef = el)}
          treatRefID={this.props.treatRefID}
          treatDate={this.props.treatDate}
          treatPID={this.props.treatPID}
          treatName={this.props.treatName}
          treatAge={this.props.treatAge}
          presentingComplaint={this.props.presentingComplaint}
          testsToBeDone={this.props.testsToBeDone}
          medicalAdvices={this.props.medicalAdvices}
          prescripRows={this.props.prescripRows}
          treatDocName={this.props.treatDocName}
          treatDocQualify={this.props.treatDocQualify}
          treatDocSpec={this.props.treatDocSpec}
        />
      </div>
    );
  }
}

export default printButton;
