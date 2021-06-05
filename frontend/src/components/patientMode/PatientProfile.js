import React, { Component, Fragment } from "react";
import "./css/patientMode.css";
import Select from "react-select";
import profilePictureMale from "./images/patientImages/profilePictureMale.jpg";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  addPatient,
  getPatients,
  updatePatient,
  getPatientsNoToken,
} from "../../actions/patients";
import { authUserUpdate } from "../../actions/auth";
import { createMessage, returnErrors } from "../../actions/messages";
import DropDownOptions from "./DropDownOptions";
import axios from "axios";
import { withAlert } from "react-alert";
import { compose } from "redux";

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/frontend/src/components/patientMode/images/Default.png";

const defaultImgUrlLength = defaultImg.length - 4;

var ErrorsFound;
var patientInfo;
export class PatientProfile extends Component {
  constructor(props) {
    super(props);
    this.uploadedImage = React.createRef(null);
    this.imageUploader = React.createRef(null);
    this._isMounted = false;
    this.state = {
      patientID: "",
      patientImage: defaultImg,
      title: "",
      fname: "",
      lname: "",
      dob: "",
      gender: "",
      Nationality: "",
      Identification: "",
      email: "",
      phone: "",
      Address: "",

      results: null,
      clickOnNewImage: false,
      viewNationalityOptions: true,

      oldPassword: "",
      newPassword: "",
      newPassword2: "",
    };
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  static propTypes = {
    addPatient: PropTypes.func.isRequired,
    patients: PropTypes.array.isRequired,
    updatePatient: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    authUserUpdate: PropTypes.func.isRequired,
  };

  countrySelect = (Nationality) => {
    if (Nationality != null) {
      this.setState({ Nationality: Nationality.label });
    } else {
      this.setState({ Nationality: "" });
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
        patientImage: e.target.files[0],
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
      patientID,
      patientImage,
      title,
      fname,
      lname,
      dob,
      gender,
      Nationality,
      Identification,
      email,
      phone,
      Address,
      clickOnNewImage,
    } = this.state;

    let form_data = new FormData();

    form_data.append("user", patientID);

    if (clickOnNewImage == true) {
      form_data.append("patientImage", patientImage, patientImage.name);
    } else {
      if (patientImage == defaultImg) {
        const config = { responseType: "blob" };
        await axios.get(patientImage, config).then((response) => {
          const img = new File(
            [response.data],
            `PatientProfileDefaultImage${patientID}`
          );
          const blob = new Blob([img], { type: "image/png" });
          form_data.append("patientImage", blob, "Default.png");
        });
      }
    }

    form_data.append("title", title);
    form_data.append("fname", fname);
    form_data.append("lname", lname);
    form_data.append("dob", dob);
    form_data.append("gender", gender);
    form_data.append("Nationality", Nationality);
    form_data.append("Identification", Identification);
    form_data.append("email", email);
    form_data.append("phone", phone);
    form_data.append("Address", Address);
    // for (var pair of form_data.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    ErrorsFound = false;
    var IdentificationDuplicate = false;
    var emailDuplicate = false;
    var invalidImage = false;
    for (let j = 0; j < patientInfo.length; j++) {
      if (patientInfo[j].user != patientID) {
        if (
          patientInfo[j].Identification != null &&
          patientInfo[j].Identification != ""
        ) {
          if (
            this.state.Identification.toLowerCase() ==
            patientInfo[j].Identification.toLowerCase()
          ) {
            IdentificationDuplicate = true;
          }
        }
        if (
          this.state.email.toLowerCase() == patientInfo[j].email.toLowerCase()
        ) {
          emailDuplicate = true;
        }
        if (
          patientImage != null &&
          patientImage != undefined &&
          patientImage.type != undefined
        ) {
          if (
            !patientImage.type.match("image/jpeg") &&
            !patientImage.type.match("image/png") &&
            !patientImage.type.match("image/jpg") &&
            !patientImage.type.match("image/gif") &&
            !patientImage.type.match("image/tiff")
          ) {
            invalidImage = true;
          }
        }
      }
    }
    if (!IdentificationDuplicate && !emailDuplicate && !invalidImage) {
      this.props.authUserUpdate(
        patientID,
        fname,
        lname,
        email,
        this.ErrorsFound
      );
      this.updatePatientProfile(ErrorsFound, patientID, form_data);
    } else if (IdentificationDuplicate == true) {
      alert.error("A user with this NIC/Passport Number already exists");
    } else if (emailDuplicate == true) {
      alert.error("A user with this email address already exists");
    } else if (invalidImage == true) {
      alert.error(
        "UPLOAD A VALID IMAGE. THE FILE YOU UPLOADED WAS EITHER NOT AN IMAGE OR A CORRUPTED IMAGE."
      );
    }
  };

  ErrorsFound = () => {
    ErrorsFound = true;
  };

  updatePatientProfile = (ErrorsFound, patientID, form_data) => {
    if (ErrorsFound == false) {
      const showSuccess = true;
      this.props.updatePatient(
        patientID,
        form_data,
        showSuccess,
        this.ErrorsFound
      );
    }
  };

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      try {
        this._isMounted && (await this.props.getPatientsNoToken());
        patientInfo = this.props.patients;

        this._isMounted && (await this.props.getPatients());
        this._isMounted &&
          this.setState({
            patientID: this.props.patients[0].user,
            patientImage: this.props.patients[0].patientImage,
            title: this.props.patients[0].title,
            fname: this.props.patients[0].fname,
            lname: this.props.patients[0].lname,
            dob: this.props.patients[0].dob,
            gender: this.props.patients[0].gender,
            Nationality: this.props.patients[0].Nationality,
            Identification:
              this.props.patients[0].Identification == null ||
              this.props.patients[0].Identification == "null"
                ? ""
                : this.props.patients[0].Identification,
            email: this.props.patients[0].email,
            phone: this.props.patients[0].phone,
            Address: this.props.patients[0].Address,
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
      .post("/api/auth/patient_login", body, config)
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
      patientID,
      patientImage,
      title,
      fname,
      lname,
      dob,
      gender,
      Nationality,
      Identification,
      email,
      phone,
      Address,
      results,
      viewNationalityOptions,
      oldPassword,
      newPassword,
      newPassword2,
    } = this.state;

    return (
      <Fragment>
        <div
          className=" bg-gra-02 font-poppins"
          style={{
            paddingRight: "5px",
            paddingLeft: "5px",
          }}
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
                            {patientImage == null ||
                            patientImage == defaultImg ? (
                              <img
                                src={defaultImg}
                                ref={this.uploadedImage}
                                className="picture-src defPic"
                                id="wizardPicturePreview"
                                title=""
                              />
                            ) : (
                              <img
                                src={`${this.state.patientImage}`}
                                ref={this.uploadedImage}
                                className="picture-src"
                                id="wizardPicturePreview"
                                title=""
                              />
                            )}
                          </div>
                          <input
                            type="file"
                            id="patientImage"
                            accept="image/*"
                            onChange={this.handleImageUpload}
                            ref={this.imageUploader}
                            name="patientImage"
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

                          {(patientImage != null &&
                            typeof patientImage == "string" &&
                            patientImage.substring(0, defaultImgUrlLength) !=
                              defaultImg.substring(0, defaultImgUrlLength)) ||
                          (patientImage != null &&
                            typeof patientImage == "object" &&
                            patientImage != defaultImg) ? (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm py-0 ml-1 mr-1"
                              style={{ fontSize: "0.7em" }}
                              onClick={() =>
                                this.setState({
                                  patientImage: defaultImg,
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
                        <label htmlFor="patientId">Patient ID</label>
                        <input
                          className="form-control form-control-sm"
                          id="patientId"
                          name="patientID"
                          onChange={this.onChange}
                          value={patientID}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="patientTitle">Title</label>
                        <select
                          className="form-control form-control-sm"
                          id="patientTitle"
                          name="title"
                          onChange={this.onChange}
                          value={title}
                        >
                          <option>-</option>
                          <option>Mr</option>
                          <option>Miss</option>
                          <option>Mrs</option>
                          <option>Ms</option>
                        </select>
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
                          name="fname"
                          onChange={this.onChange}
                          value={fname}
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
                          name="lname"
                          onChange={this.onChange}
                          value={lname}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row row-space">
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="inputBirthday">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          id="inputBirthday"
                          name="dob"
                          onChange={this.onChange}
                          value={dob}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="inputGender">Gender</label>
                        <div className="p-t-10">
                          <label className="radio-container m-r-45">
                            <span style={{ fontSize: "14px" }}>Male</span>
                            <input
                              type="radio"
                              name="gender"
                              onChange={this.onChange}
                              value="Male"
                              checked={gender == "Male" ? true : false}
                            />
                            <span className="checkmark"></span>
                          </label>
                          <label className="radio-container">
                            <span style={{ fontSize: "14px" }}>Female</span>
                            <input
                              type="radio"
                              name="gender"
                              onChange={this.onChange}
                              value="Female"
                              checked={gender == "Female" ? true : false}
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
                            country={Nationality}
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
                          name="Identification"
                          onChange={this.onChange}
                          value={Identification}
                        />
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
                          name="phone"
                          onChange={this.onChange}
                          value={phone}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row row-space">
                    <div className="col-md-12">
                      <div className="form-group ">
                        <label htmlFor="InputAddress">Address</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="InputAddress"
                          placeholder="Address"
                          name="Address"
                          onChange={this.onChange}
                          value={Address}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-space mt-4">
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
  patients: state.patients.patients,
  auth: state.auth,
});

export default compose(
  withAlert(),
  connect(mapStateToProps, {
    addPatient,
    getPatients,
    updatePatient,
    authUserUpdate,
    createMessage,
    getPatientsNoToken,
  })
)(PatientProfile);
