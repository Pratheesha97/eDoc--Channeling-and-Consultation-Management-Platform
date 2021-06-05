import React, { Component, Fragment } from "react";
import imageSlider1 from "../patientMode/images/imageSlider/imageSlider1.jpg";
import imageSlider2 from "./images/imageSlider/imageSlider2.jpg";
import imageSlider3 from "./images/imageSlider/imageSlider3.jpg";
import imageSlider4 from "./images/imageSlider/imageSlider4.jpg";
import MyProfilePatientImg from "./images/MyProfilePatientImg.jpg";
import ChannellingHistoryImg from "./images/ChannellingHistoryImg.jpg";
import BookAppointmentImg from "./images/BookAppointmentImg.jpg";
import UpcomingAppointmentsImg from "./images/UpcomingAppointmentsImg.jpg";
import { Link } from "react-router-dom";

export class PatientOverview extends Component {
  render() {
    return (
      <Fragment>
        {/*=========================================================== Image Slider Card =============================================== */}
        <div className="pt-4">
          <div className="slider-container-patient">
            <div className="image-container-patient">
              <img src={imageSlider1} className="slider-image-patient" />
              <img src={imageSlider2} className="slider-image-patient" />
              <img src={imageSlider3} className="slider-image-patient" />
              <img src={imageSlider4} className="slider-image-patient" />
            </div>
          </div>
        </div>

        {/*=========================================================== Services Cards Set =============================================== */}
        <div className="services-wrap-patient pt-2">
          <div className="services-card-patient ml-4">
            <div className="image">
              <img src={MyProfilePatientImg} />
            </div>
            <div className="details">
              <div className="center">
                <p>
                  <Link to="/home/profile">
                    <button type="button" className="btn btn-dark btn-sm">
                      Visit My Profile
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="services-card-patient ml-4">
            <div className="image">
              <img src={BookAppointmentImg} />
            </div>
            <div className="details">
              <div className="center">
                <p>
                  <Link to="/home/book_appointment">
                    <button type="button" className="btn btn-dark btn-sm">
                      Book <br></br>Appointment
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="services-card-patient ml-4">
            <div className="image">
              <img src={UpcomingAppointmentsImg} />
            </div>
            <div className="details">
              <div className="center">
                <p>
                  <Link to="/home/upcoming_appointments">
                    <button type="button" className="btn btn-dark btn-sm">
                      View Upcoming <br></br>Appointments
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="services-card-patient ml-4">
            <div className="image">
              <img src={ChannellingHistoryImg} />
            </div>
            <div className="details">
              <div className="center">
                <p>
                  <Link to="/home/channelling_history">
                    <button type="button" className="btn btn-dark btn-sm">
                      Visit Channelling <br></br>History
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

export default PatientOverview;
