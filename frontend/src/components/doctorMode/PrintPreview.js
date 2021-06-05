import React from "react";
import companyLogo from "../layout/images/logo5.png";

var countID = 0;

function PrintPreview(props) {
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

  countID = 0;

  return (
    <React.Fragment>
      <div
        style={{
          margin: "0 auto",
          width: "90%",
        }}
      >
        <div>
          <div className="text-center">
            <img src={companyLogo} width="80" height="50" className="mt-5" />
            <p>No. 240, Colombo, Sri Lanka</p>
            <p>edocHospital@edoc.com</p>
            <br></br>
            <p style={{ textAlign: "left" }}>
              {props.treatRefID}
              <span style={{ float: "right" }}>
                Date:{" "}
                {new Date(props.treatDate).getDate() < 10
                  ? `0${new Date(props.treatDate).getDate()}`
                  : new Date(props.treatDate).getDate()}
                -{monthNames[new Date(props.treatDate).getMonth()]}-
                {new Date(props.treatDate).getFullYear()}
              </span>
            </p>
            <hr style={{ borderTop: "1px solid black" }}></hr>
          </div>
          <h6>
            <table className="table table-bordered table-sm mt-4">
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #888888" }}>
                    <b>Patient ID: {props.treatPID}</b>
                  </td>
                  <td style={{ border: "1px solid #888888" }}>
                    <b>{props.treatName}</b>
                  </td>
                  <td style={{ border: "1px solid #888888" }}>
                    <b>{props.treatAge} yrs</b>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="table table-bordered table-sm mt-4">
              <tbody>
                <tr>
                  <td>
                    <b>Presenting Complaint: </b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>{props.presentingComplaint}</p>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="table table-bordered table-sm">
              <tbody>
                <tr>
                  <td>
                    <b>Tests to be done: </b>
                  </td>
                </tr>
                <tr>
                  <td>{props.testsToBeDone}</td>
                </tr>
              </tbody>
            </table>

            <table className="table table-bordered table-sm">
              <tbody>
                <tr>
                  <td>
                    <b>Medical Advices: </b>
                  </td>
                </tr>
                <tr>
                  <td>{props.medicalAdvices}</td>
                </tr>
              </tbody>
            </table>

            {/*======================================================Prescription Table======================================== */}

            <div className="modal-body watermark">
              <h1>℞</h1>
              <table className="table table-sm table-hover">
                <thead className="thead-light">
                  <tr style={{ fontSize: "13px" }}>
                    <th scope="col">#</th>
                    <th scope="col">Drug Name</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Dosage</th>
                    <th scope="col">Instructions</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>

                <tbody style={{ fontSize: "14px" }}>
                  {props.prescripRows != undefined && props.prescripRows != ""
                    ? props.prescripRows.map((prescripRows, index) => {
                        if (prescripRows.drugName != "") {
                          countID = countID + 1;
                          return (
                            <tr key={index}>
                              <th scope="row">{countID}</th>
                              <td>{prescripRows.drugName}</td>
                              <td>
                                {prescripRows.duration.howMany}{" "}
                                {prescripRows.duration.DWM}
                              </td>
                              <td>
                                {prescripRows.dosage.morn}-
                                {prescripRows.dosage.aft}-
                                {prescripRows.dosage.eve}-
                                {prescripRows.dosage.night}{" "}
                              </td>
                              <td>{prescripRows.instructions}</td>
                              <td>{prescripRows.notes}</td>
                            </tr>
                          );
                        }
                      })
                    : null}
                </tbody>
              </table>
              <div className=" text-left" style={{ fontSize: "11px" }}>
                *for the Dosage, "Morning-Afternoon-Evening-Night" format is
                used.
              </div>
              <br></br>
            </div>

            <div className="text-center">
              <div className="text-center pt-5" style={{ float: "right" }}>
                <br></br> <br></br>
                <p>...................................................</p>
                <p> {props.treatDocName}</p>
                <p>{props.treatDocQualify}</p>
                <p>{props.treatDocSpec}</p>
              </div>
            </div>
          </h6>
        </div>
      </div>
    </React.Fragment>
  );
}

export default PrintPreview;
