import React, { Component, Fragment } from "react";
import "./css/doctorMode.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  addDoctor,
  getDoctors,
  updateDoctor,
  getDoctorsNoToken,
} from "../../actions/doctors";
import { authUserUpdate } from "../../actions/auth";
import DropDownOptions from "../patientMode/DropDownOptions";
import axios from "axios";
import { createMessage, returnErrors } from "../../actions/messages";
import { withAlert } from "react-alert";
import { compose } from "redux";

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/frontend/src/components/doctorMode/images/Default.png";

const defaultImgUrlLength = defaultImg.length - 4;

var ErrorsFound;
var doctorInfo;

export class DoctorProfile extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.uploadedImage = React.createRef(null);
    this.imageUploader = React.createRef(null);

    this.state = {
      doctorID: "",
      doctorImage: defaultImg,
      doctorFName: "",
      doctorLName: "",
      doctorGender: "",
      doctorNationality: "",
      doctorIdentification: "",
      Specialization: "",
      Qualifications: "",
      chargePerSession: "",
      email: "",
      doctorPhone: "",
      results: null,
      clickOnNewImage: false,
      viewNationalityOptions: true,
      viewSpecializationSuggests: true,

      oldPassword: "",
      newPassword: "",
      newPassword2: "",
    };

    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  static propTypes = {
    addDoctor: PropTypes.func.isRequired,
    doctors: PropTypes.array.isRequired,
    updateDoctor: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    authUserUpdate: PropTypes.func.isRequired,
  };

  countrySelect = (doctorNationality) => {
    if (doctorNationality != null) {
      this.setState({ doctorNationality: doctorNationality.label });
    } else {
      this.setState({ doctorNationality: "" });
    }
  };

  doctorSpecialization = (specialization) => {
    if (specialization != null) {
      this.setState({ Specialization: specialization.label });
    } else {
      this.setState({ Specialization: "" });
    }
  };

  handleImageUpload(e) {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = this.uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);

      this.setState({
        doctorImage: e.target.files[0],
        clickOnNewImage: true,
      });
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const alert = this.props.alert;

    const {
      doctorID,
      doctorImage,
      doctorFName,
      doctorLName,
      doctorGender,
      doctorNationality,
      doctorIdentification,
      Specialization,
      Qualifications,
      chargePerSession,
      email,
      doctorPhone,
      clickOnNewImage,
    } = this.state;

    let form_data = new FormData();

    form_data.append("user", doctorID);

    if (clickOnNewImage == true) {
      form_data.append("doctorImage", doctorImage, doctorImage.name);
    } else {
      if (doctorImage == defaultImg) {
        const config = { responseType: "blob" };
        await axios.get(doctorImage, config).then((response) => {
          const img = new File(
            [response.data],
            `DoctorProfileDefaultImage${doctorID}`
          );
          const blob = new Blob([img], { type: "image/png" });
          form_data.append("doctorImage", blob, "Default.png");
        });
      }
    }

    form_data.append("doctorFName", doctorFName);
    form_data.append("doctorLName", doctorLName);
    form_data.append("doctorGender", doctorGender);
    form_data.append("doctorNationality", doctorNationality);
    form_data.append("doctorIdentification", doctorIdentification);
    form_data.append("Specialization", Specialization);
    form_data.append("Qualifications", Qualifications);
    form_data.append("chargePerSession", chargePerSession);
    form_data.append("email", email);
    form_data.append("doctorPhone", doctorPhone);

    ErrorsFound = false;
    var IdentificationDuplicate = false;
    var emailDuplicate = false;
    var nullSpecialization = false;
    var nullNationality = false;
    var invalidImage = false;
    for (let j = 0; j < doctorInfo.length; j++) {
      if (doctorInfo[j].user != doctorID) {
        if (
          doctorInfo[j].doctorIdentification != null &&
          doctorInfo[j].email != null
        ) {
          if (
            this.state.doctorIdentification.toLowerCase() ==
            doctorInfo[j].doctorIdentification.toLowerCase()
          ) {
            IdentificationDuplicate = true;
          }
          if (
            this.state.email.toLowerCase() == doctorInfo[j].email.toLowerCase()
          ) {
            emailDuplicate = true;
          }

          if (
            doctorImage != null &&
            doctorImage != undefined &&
            doctorImage.type != undefined
          ) {
            if (
              !doctorImage.type.match("image/jpeg") &&
              !doctorImage.type.match("image/png") &&
              !doctorImage.type.match("image/jpg") &&
              !doctorImage.type.match("image/gif") &&
              !doctorImage.type.match("image/tiff")
            ) {
              invalidImage = true;
            }
          }
          if (Specialization == "" || Specialization == null) {
            nullSpecialization = true;
          }
          if (doctorNationality == "" || doctorNationality == null) {
            nullNationality = true;
          }
        }
      }
    }
    if (
      !IdentificationDuplicate &&
      !emailDuplicate &&
      !nullSpecialization &&
      !nullNationality &&
      !invalidImage
    ) {
      this.props.authUserUpdate(
        doctorID,
        doctorFName,
        doctorLName,
        email,
        this.ErrorsFound
      );
      this.updateDoctorProfile(ErrorsFound, doctorID, form_data);
    } else if (IdentificationDuplicate == true) {
      alert.error("A user with this NIC/Passport Number already exists");
    } else if (emailDuplicate == true) {
      alert.error("A user with this email address already exists");
    } else if (nullSpecialization == true) {
      alert.error("Specialization may not be blank");
    } else if (nullNationality == true) {
      alert.error("Nationality may not be blank");
    } else if (invalidImage == true) {
      alert.error(
        "UPLOAD A VALID IMAGE. THE FILE YOU UPLOADED WAS EITHER NOT AN IMAGE OR A CORRUPTED IMAGE."
      );
    }
  };

  ErrorsFound = () => {
    ErrorsFound = true;
  };

  updateDoctorProfile = (ErrorsFound, doctorID, form_data) => {
    if (ErrorsFound == false) {
      const showSuccess = true;
      this.props.updateDoctor(
        doctorID,
        form_data,
        showSuccess,
        this.ErrorsFound
      );
    }
  };

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this._isMounted && (await this.props.getDoctorsNoToken());
      doctorInfo = this.props.doctors;

      this._isMounted && (await this.props.getDoctors());
      try {
        this._isMounted &&
          this.setState({
            doctorID: this.props.doctors[0].user,
            doctorImage: this.props.doctors[0].doctorImage,
            doctorFName: this.props.doctors[0].doctorFName,
            doctorLName: this.props.doctors[0].doctorLName,
            doctorGender: this.props.doctors[0].doctorGender,
            doctorNationality: this.props.doctors[0].doctorNationality,
            doctorIdentification: this.props.doctors[0].doctorIdentification,
            Specialization: this.props.doctors[0].Specialization,
            Qualifications: this.props.doctors[0].Qualifications,
            chargePerSession: this.props.doctors[0].chargePerSession,
            email: this.props.doctors[0].email,
            doctorPhone: this.props.doctors[0].doctorPhone,
            results: true,
          });
      } catch {}
    }
  }

  componentWillUnmount() {
    this.setState({
      viewNationalityOptions: false,
    });
    this._isMounted = false;
  }

  submitNewPassword = async (e) => {
    e.preventDefault();
    const alert = this.props.alert;
    const { email, oldPassword, newPassword, newPassword2 } = this.state;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email: email, password: oldPassword });
    var tokenVal;
    await axios
      .post("/api/auth/doctor_login", body, config)
      .then((res) => {
        tokenVal = res.data.token;
      })
      .catch((err) => {
        alert.error("Your old password is incorrect!");
      });

    if (tokenVal != undefined) {
      if (newPassword !== newPassword2) {
        alert.error("Passwords do not match");
      } else {
        const body2 = {
          new_password1: newPassword,
          new_password2: newPassword2,
          old_password: oldPassword,
        };

        var formData = new FormData();

        for (var name in body2) {
          formData.append(name, body2[name]);
        }

        await axios
          .post("api/auth/password/change", formData, {
            headers: { Authorization: "Token " + tokenVal },
          })
          .then((res) => {
            alert.success("Password changed Successfully!");
          })
          .catch((err) => {
            for (let i = 0; i < err.response.data.new_password2.length; i++) {
              alert.error(`${err.response.data.new_password2[i]}`);
            }
          });
      }
    }
  };

  render() {
    const {
      doctorID,
      doctorImage,
      doctorFName,
      doctorLName,
      doctorGender,
      doctorNationality,
      doctorIdentification,
      Specialization,
      Qualifications,
      chargePerSession,
      email,
      doctorPhone,
      results,
      viewNationalityOptions,
      viewSpecializationSuggests,
      oldPassword,
      newPassword,
      newPassword2,
    } = this.state;
    return (
      <Fragment>
        <div
          className="bg-gra-02  font-poppins"
          style={{ paddingRight: "5px", paddingLeft: "5px" }}
        >
          <div className="wrapper wrapper--w680">
            <div className="card card-4">
              <div
                className="card-body"
                style={{ paddingTop: "30px", paddingBottom: "30px" }}
              >
                <h3 className="title">Update your profile</h3>
                <form onSubmit={this.onSubmit} encType="multipart/form-data">
                  <div className="row row-space">
                    <div className="form-group" style={{ margin: "0 auto" }}>
                      <div className="picture-container">
                        <div className="picture">
                          <div
                            onClick={() => this.imageUploader.current.click()}
                          >
                            {doctorImage == null ||
                            doctorImage == defaultImg ? (
                              <img
                                src={defaultImg}
                                ref={this.uploadedImage}
                                className="picture-src defPic"
                                id="wizardPicturePreview"
                                title=""
                              />
                            ) : (
                              <img
                                src={`${this.state.doctorImage}`}
                                ref={this.uploadedImage}
                                className="picture-src"
                                id="wizardPicturePreview"
                                title=""
                              />
                            )}
                          </div>

                          <input
                            type="file"
                            id="doctorImage"
                            accept="image/*"
                            onChange={this.handleImageUpload}
                            ref={this.imageUploader}
                            name="doctorImage"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="pt-2 pb-1">
                          <button
                            type="button"
                            className="btn btn-dark btn-sm py-0"
                            onClick={() => this.imageUploader.current.click()}
                            style={{ fontSize: "0.7em" }}
                          >
                            Change Profile Picture
                          </button>
                          {(doctorImage != null &&
                            typeof doctorImage == "string" &&
                            doctorImage.substring(0, defaultImgUrlLength) !=
                              defaultImg.substring(0, defaultImgUrlLength)) ||
                          (doctorImage != null &&
                            typeof doctorImage == "object" &&
                            doctorImage != defaultImg) ? (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm py-0 ml-1 mr-1"
                              style={{ fontSize: "0.7em" }}
                              onClick={() =>
                                this.setState({
                                  doctorImage: defaultImg,
                                  clickOnNewImage: false,
                                })
                              }
                            >
                              x
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="doctorID">Doctor ID</label>
                        <input
                          className="form-control form-control-sm"
                          id="doctorID"
                          name="doctorID"
                          onChange={this.onChange}
                          value={doctorID}
                          disabled={true}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="inputFname">First Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="inputFname"
                          placeholder="First Name"
                          name="doctorFName"
                          onChange={this.onChange}
                          value={doctorFName}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="inputLname">Last Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="inputLname"
                          placeholder="Last Name"
                          name="doctorLName"
                          onChange={this.onChange}
                          value={doctorLName}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-12">
                      <div className="form-group ">
                        <label htmlFor="inputGender">Gender</label>
                        <div className="p-t-10">
                          <label className="radio-container m-r-45">
                            <span style={{ fontSize: "14px" }}>Male</span>
                            <input
                              type="radio"
                              name="doctorGender"
                              onChange={this.onChange}
                              value="Male"
                              checked={doctorGender == "Male" ? true : false}
                            />
                            <span className="checkmark"></span>
                          </label>
                          <label className="radio-container">
                            <span style={{ fontSize: "14px" }}>Female</span>
                            <input
                              type="radio"
                              name="doctorGender"
                              onChange={this.onChange}
                              value="Female"
                              checked={doctorGender == "Female" ? true : false}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="inputNationality">Nationality</label>
                        {results && (
                          <DropDownOptions
                            countrySelect={this.countrySelect}
                            country={doctorNationality}
                            viewNationalityOptions={viewNationalityOptions}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="inputIdentification">
                          NIC/Passport Number
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="inputIdentification"
                          placeholder="NIC/Passport number"
                          name="doctorIdentification"
                          onChange={this.onChange}
                          value={doctorIdentification}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="Specialization">Specialization</label>
                        {results && (
                          <DropDownOptions
                            viewSpecializationSuggests={
                              viewSpecializationSuggests
                            }
                            bookDoctorSpecialization={this.doctorSpecialization}
                            doctorSpecDefault={Specialization}
                            channelHistory={false}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="ChannellingFee">
                          Channelling Fee (LKR)
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="ChannellingFee"
                          placeholder="xxxx.xx"
                          name="chargePerSession"
                          onChange={this.onChange}
                          value={chargePerSession}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-12">
                      <div className="form-group ">
                        <label htmlFor="Qualifications">Qualifications</label>
                        <textarea
                          className="form-control form-control-sm"
                          id="Qualifications"
                          rows="2"
                          placeholder="Eg: MB.BS(Colombo), MD(Colombo),MRCP(UK), etc.."
                          name="Qualifications"
                          onChange={this.onChange}
                          value={Qualifications}
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="inputEmail">Email Address</label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          id="inputEmail"
                          placeholder="Email"
                          name="email"
                          onChange={this.onChange}
                          value={email}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="inputPhone">Contact Number</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="inputPhone"
                          placeholder="Contact Number"
                          name="doctorPhone"
                          onChange={this.onChange}
                          value={doctorPhone}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-12">
                      <div className="form-group ">
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm btn-block"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-gra-02 p-b-50 font-poppins mt-4"
          style={{ paddingRight: "5px", paddingLeft: "5px" }}
        >
          <div className="card card-4 wrapper wrapper--w680">
            <div className="card-body pt-0 pb-4">
              <h3 className="title">Account settings</h3>
              <form
                onSubmit={this.submitNewPassword}
                encType="multipart/form-data"
              >
                <div className="row row-space">
                  <div className="col-md-12">
                    <div className="form-group ">
                      <label htmlFor="InputAddress">Old Password</label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        id="OldPassword"
                        placeholder="Old Password"
                        name="oldPassword"
                        onChange={this.onChange}
                        value={oldPassword}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row row-space">
                  <div className="col-md-12">
                    <div className="form-group ">
                      <label htmlFor="InputAddress">New Password</label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        id="NewPassword"
                        placeholder="New Password"
                        name="newPassword"
                        onChange={this.onChange}
                        value={newPassword}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row row-space">
                  <div className="col-md-12 mb-3">
                    <div className="form-group ">
                      <label htmlFor="InputAddress">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        id="ConfirmNewPassword"
                        placeholder="Confirm New Password"
                        name="newPassword2"
                        onChange={this.onChange}
                        value={newPassword2}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row row-space">
                  <div className="col-md-12">
                    <div className="form-group ">
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm btn-block change-password-button"
                        style={{
                          backgroundColor: "#3f51b5",
                          borderColor: " #3f51b5",
                        }}
                      >
                        Change password
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  doctors: state.doctors.doctors,
  auth: state.auth,
});

export default compose(
  withAlert(),
  connect(mapStateToProps, {
    addDoctor,
    getDoctors,
    updateDoctor,
    authUserUpdate,
    createMessage,
    getDoctorsNoToken,
  })
)(DoctorProfile);
