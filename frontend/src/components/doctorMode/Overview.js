import React, { Component, Fragment } from "react";
import notificationIcon from "./images/notification-icon.png";
import imageSlider1 from "./images/imageSlider/imageSlider1.jpg";
import imageSlider2 from "./images/imageSlider/imageSlider2.jpg";
import imageSlider3 from "./images/imageSlider/imageSlider3.jpg";
import CompletedAppointmentsFinal1 from "./images/CompletedAppointmentsFinal1.jpg";
import EarningsFinal1 from "./images/EarningsFinal1.jpg";
import MyProfileFinal1 from "./images/MyProfileFinal1.jpg";
import PendingAppointmentsFinal1 from "./images/PendingAppointmentsFinal1.jpg";
import WorkScheduleFinal1 from "./images/WorkScheduleFinal1.jpg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAppointmentsNoToken } from "../../actions/appointments";

export class Overview extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      todayAppointmentCount: 0,
    };
  }

  static propTypes = {
    appointments: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
  };
  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this._isMounted && (await this.props.getAppointmentsNoToken());
      const appointmentInfo = this.props.appointments;

      var today = new Date();
      today.setHours(0, 0, 0);
      var count = 0;
      for (let i = 0; i < appointmentInfo.length; i++) {
        if (
          appointmentInfo[i].doctorID == this.props.auth.user.id &&
          appointmentInfo[i].status == "PENDING"
        ) {
          var tempDate = new Date(appointmentInfo[i].date);
          tempDate.setHours(0, 0, 0);
          if (tempDate.toString() == today.toString()) {
            count = count + 1;
          }
        }
      }
      this._isMounted &&
        this.setState({
          todayAppointmentCount: count,
        });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Fragment>
        {/*=========================================================== Image Slider Card =============================================== */}

        <div className="slider-container pt-5">
          <div className="image-container">
            <img src={imageSlider1} className="slider-image" />
            <img src={imageSlider2} className="slider-image" />
            <img src={imageSlider3} className="slider-image" />
          </div>

          <div className="overview-basic-info">
            {/*=========================================================== Number of Appointments today Card =============================================== */}
            <div className="pt-3">
              <div className="card overview-appointment-count">
                <div className="card-body" style={{ backgroundColor: "black" }}>
                  You have {this.state.todayAppointmentCount} Appointments today
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*=========================================================== Services Cards Set =============================================== */}
        <div className="services-wrap">
          <div className="services-card">
            <div className="image">
              <img src={MyProfileFinal1} />
            </div>
            <div className="details">
              <div className="center">
                <p>
                  <Link to="/doctor_home/profile">
                    <button type="button" className="btn btn-dark btn-sm">
                      Visit My Profile
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="services-card" style={{ marginLeft: "20px" }}>
            <div className="image">
              <img src={PendingAppointmentsFinal1} />
            </div>
            <div className="details">
              <div className="center">
                <p>
                  <Link to="/doctor_home/pending_appointments">
                    <button type="button" className="btn btn-dark btn-sm">
                      Visit Pending <br></br>Appointments
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="services-card" style={{ marginLeft: "20px" }}>
            <div className="image">
              <img src={CompletedAppointmentsFinal1} />
            </div>
            <div className="details">
              <div className="center">
                <p>
                  <Link to="/doctor_home/completed_appointments">
                    <button type="button" className="btn btn-dark btn-sm">
                      Visit Completed <br></br>Appointments
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="services-card" style={{ marginLeft: "20px" }}>
            <div className="image">
              <img src={WorkScheduleFinal1} />
            </div>
            <div className="details">
              <div className="center">
                <p>
                  <Link to="/doctor_home/work_schedule">
                    <button type="button" className="btn btn-dark btn-sm">
                      Visit Work <br></br>Schedule
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="services-card" style={{ marginLeft: "20px" }}>
            <div className="image">
              <img src={EarningsFinal1} />
            </div>
            <div className="details">
              <div className="center">
                <p>
                  <Link to="/doctor_home/earnings">
                    <button type="button" className="btn btn-dark btn-sm">
                      Visit Earnings
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  appointments: state.appointments.appointments,
});

export default connect(mapStateToProps, {
  getAppointmentsNoToken,
})(Overview);
