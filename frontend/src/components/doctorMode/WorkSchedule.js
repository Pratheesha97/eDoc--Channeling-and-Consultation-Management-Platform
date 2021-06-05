import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types"; //type "impt" + Tab/Enter (Shortcut).
import {
  addWorkSchedule,
  deleteWorkSchedule,
  getWorkSchedules,
} from "../../actions/workSchedules";
import { withAlert } from "react-alert";
import { compose } from "redux";
import axios from "axios";
import { GET_WORKSCHEDULES } from "../../actions/types";
import workSchedules from "../../reducers/workSchedules";

export class WorkSchedule extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      doctorID: this.props.auth.user.id,
      monday: {
        morning: { time: "", appointmentLimit: "Any" },
        afternoon: { time: "", appointmentLimit: "Any" },
        evening: { time: "", appointmentLimit: "Any" },
        night: { time: "", appointmentLimit: "Any" },
      },
      tuesday: {
        morning: { time: "", appointmentLimit: "Any" },
        afternoon: { time: "", appointmentLimit: "Any" },
        evening: { time: "", appointmentLimit: "Any" },
        night: { time: "", appointmentLimit: "Any" },
      },
      wednesday: {
        morning: { time: "", appointmentLimit: "Any" },
        afternoon: { time: "", appointmentLimit: "Any" },
        evening: { time: "", appointmentLimit: "Any" },
        night: { time: "", appointmentLimit: "Any" },
      },
      thursday: {
        morning: { time: "", appointmentLimit: "Any" },
        afternoon: { time: "", appointmentLimit: "Any" },
        evening: { time: "", appointmentLimit: "Any" },
        night: { time: "", appointmentLimit: "Any" },
      },
      friday: {
        morning: { time: "", appointmentLimit: "Any" },
        afternoon: { time: "", appointmentLimit: "Any" },
        evening: { time: "", appointmentLimit: "Any" },
        night: { time: "", appointmentLimit: "Any" },
      },
      saturday: {
        morning: { time: "", appointmentLimit: "Any" },
        afternoon: { time: "", appointmentLimit: "Any" },
        evening: { time: "", appointmentLimit: "Any" },
        night: { time: "", appointmentLimit: "Any" },
      },
      sunday: {
        morning: { time: "", appointmentLimit: "Any" },
        afternoon: { time: "", appointmentLimit: "Any" },
        evening: { time: "", appointmentLimit: "Any" },
        night: { time: "", appointmentLimit: "Any" },
      },
    };
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    addWorkSchedule: PropTypes.func.isRequired,
    deleteWorkSchedule: PropTypes.func.isRequired,
    workSchedules: PropTypes.array.isRequired,
  };

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this._isMounted && (await this.props.getWorkSchedules());
      this._isMounted && this.setInitialState();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setInitialState = async () => {
    for (let i = 0; i < this.props.workSchedules.length; i++) {
      this._isMounted &&
        (await this.setState({
          [this.props.workSchedules[i].day]: {
            ...this.state[this.props.workSchedules[i].day],
            [this.props.workSchedules[i].timeSlot]: {
              ...this.state[this.props.workSchedules[i].timeSlot],
              time: this.props.workSchedules[i].time,
              appointmentLimit: this.props.workSchedules[i].appointmentLimit,
            },
          },
        }));
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const alert = this.props.alert;
    var schedule = [];
    const dayKeys = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const timePeriod = ["morning", "afternoon", "evening", "night"];

    for (var i = 0; i < dayKeys.length; i++) {
      for (var j = 0; j < timePeriod.length; j++) {
        if (this.state[dayKeys[i]][timePeriod[j]].time != "") {
          if (this.state[dayKeys[i]][timePeriod[j]].time != "None") {
            const newdoctorID = this.state.doctorID;
            const newday = dayKeys[i];
            const newtimeSlot = timePeriod[j];
            const newtime = this.state[dayKeys[i]][timePeriod[j]].time;
            const newappointmentLimit =
              this.state[dayKeys[i]][timePeriod[j]].appointmentLimit;
            const obj = {
              doctorID: newdoctorID,
              day: newday,
              timeSlot: newtimeSlot,
              time: newtime,
              appointmentLimit: newappointmentLimit,
            };
            schedule.push(obj);
          }
        }
      }
    }
    console.log(schedule);

    for (var m = 0; m < this.props.workSchedules.length; m++) {
      if (this.props.workSchedules[m].doctorID == this.state.doctorID) {
        this.props.deleteWorkSchedule(this.props.workSchedules[m].ID);
      }
    }

    for (var n = 0; n < schedule.length; n++) {
      this.props.addWorkSchedule(schedule[n]);
    }
    alert.success("Work Schedule Updated Successfully!");
  };

  onChange = (key, timeSlot, e, type) => {
    if (type == "time") {
      this.setState({
        [key]: {
          ...this.state[key],
          [timeSlot]: {
            ...this.state[timeSlot],
            [type]: e.target.value,
            appointmentLimit: this.state[key][timeSlot].appointmentLimit,
          },
        },
      });
    } else {
      this.setState({
        [key]: {
          ...this.state[key],
          [timeSlot]: {
            ...this.state[timeSlot],
            [type]: e.target.value,
            time: this.state[key][timeSlot].time,
          },
        },
      });
    }
  };

  checkFilled = () => {
    var inputVal = document.getElementById("newtime");
    if (inputVal.value != "") {
      inputVal.style.backgroundColor = "yellow";
    } else {
      inputVal.style.backgroundColor = "";
    }
  };

  render() {
    var dayKeys = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
      7: "sunday",
    };
    var timePeriod = {
      1: "morning",
      2: "afternoon",
      3: "evening",
      4: "night",
    };
    return (
      <Fragment>
        <div className="pt-5">
          <div
            className="card"
            style={{
              margin: "0 auto",
              width: "1055px",
              boxShadow: "0px 8px 20px 0px rgba(0, 0, 0, 0.15)",
            }}
          >
            <form className="card-body" onSubmit={this.onSubmit}>
              <h4>
                <b>Current Work Schedule</b>
              </h4>
              <h6 style={{ color: "#545454" }}>
                <br></br>
                <table
                  className="table table-hover mt-3"
                  onLoad={() => this.setInitialValues}
                >
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Monday</th>
                      <th scope="col">Tuesday</th>
                      <th scope="col">Wednesday</th>
                      <th scope="col">Thursday</th>
                      <th scope="col">Friday</th>
                      <th scope="col">Saturday</th>
                      <th scope="col">Sunday</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.keys(timePeriod).map((key2) => (
                      <tr key={timePeriod[key2]}>
                        <td>
                          <table>
                            <tbody>
                              <tr style={{ borderTopStyle: "hidden" }}>
                                <th style={{ minWidth: "140px" }} scope="row">
                                  {timePeriod[key2]}
                                </th>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    minWidth: "140px",
                                  }}
                                >
                                  Set the Appt. Limit
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        {Object.keys(dayKeys).map((key1) => (
                          <td key={dayKeys[key1]}>
                            <table>
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      padding: "0px",
                                      borderStyle: "hidden",
                                    }}
                                  >
                                    <select
                                      className="form-control form-control-sm"
                                      style={{
                                        backgroundColor:
                                          this.state[dayKeys[key1]][
                                            timePeriod[key2]
                                          ].time === "" ||
                                          this.state[dayKeys[key1]][
                                            timePeriod[key2]
                                          ].time === "None"
                                            ? ""
                                            : "#8ed1fc",
                                      }}
                                      name="newtime"
                                      id="newtime"
                                      onChange={(e) => {
                                        this.onChange(
                                          dayKeys[key1],
                                          timePeriod[key2],
                                          e,
                                          "time"
                                        );
                                      }}
                                      value={
                                        this.state[dayKeys[key1]][
                                          timePeriod[key2]
                                        ].time
                                      }
                                    >
                                      {[timePeriod[key2]] == "morning" ? (
                                        <Fragment>
                                          <option>None</option>
                                          <option>8.00 AM</option>
                                          <option>9.00 AM</option>
                                          <option>10.00 AM</option>
                                          <option>11.00 AM</option>
                                        </Fragment>
                                      ) : (
                                        <Fragment>
                                          {[timePeriod[key2]] == "afternoon" ? (
                                            <Fragment>
                                              <option>None</option>
                                              <option>12.00 PM</option>
                                              <option>1.00 PM</option>
                                              <option>2.00 PM</option>
                                              <option>3.00 PM</option>
                                            </Fragment>
                                          ) : (
                                            <Fragment>
                                              {[timePeriod[key2]] ==
                                              "evening" ? (
                                                <Fragment>
                                                  <option>None</option>
                                                  <option>4.00 PM</option>
                                                  <option>5.00 PM</option>
                                                  <option>6.00 PM</option>
                                                </Fragment>
                                              ) : (
                                                <Fragment>
                                                  <option>None</option>
                                                  <option>7.00 PM</option>
                                                  <option>8.00 PM</option>
                                                  <option>9.00 PM</option>
                                                </Fragment>
                                              )}
                                            </Fragment>
                                          )}
                                        </Fragment>
                                      )}
                                      )
                                    </select>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      paddingRight: "0px",
                                      paddingLeft: "0px",
                                      borderStyle: "hidden",
                                      paddingBottom: "0px",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      style={{
                                        backgroundColor:
                                          this.state[dayKeys[key1]][
                                            timePeriod[key2]
                                          ].time === "" ||
                                          this.state[dayKeys[key1]][
                                            timePeriod[key2]
                                          ].time === "None"
                                            ? ""
                                            : "#8ed1fc",
                                      }}
                                      className="form-control form-control-sm"
                                      id="newappointmentLimit"
                                      placeholder="Any"
                                      title="Maximum Number of Appointments per Session"
                                      name="newappointmentLimit"
                                      onChange={(e) => {
                                        this.onChange(
                                          dayKeys[key1],
                                          timePeriod[key2],
                                          e,
                                          "appointmentLimit"
                                        );
                                      }}
                                      value={
                                        this.state[dayKeys[key1]][
                                          timePeriod[key2]
                                        ].appointmentLimit
                                      }
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pt-3 pb-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm change-password-button"
                    data-toggle="modal"
                    data-target="#WorkingScheduleModalCenter"
                    style={{ float: "right", fontSize: "13px" }}
                  >
                    Save Changes
                  </button>
                </div>
              </h6>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  workSchedules: state.workSchedules.workSchedules,
  auth: state.auth,
});

export default compose(
  withAlert(),
  connect(mapStateToProps, {
    addWorkSchedule,
    deleteWorkSchedule,
    getWorkSchedules,
  })
)(WorkSchedule);
