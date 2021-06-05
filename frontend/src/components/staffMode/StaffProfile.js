import React, { Component, Fragment } from "react";
import "../patientMode/css/patientMode.css";
import profilePictureMale from "./images/patientImages/profilePictureMale.jpg";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addStaff, getStaffs, updateStaff } from "../../actions/staffs";
import axios from "axios";
import { withAlert } from "react-alert";
import { compose } from "redux";

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/frontend/src/components/staffMode/images/Default.png";

const defaultImgUrlLength = defaultImg.length - 4;

export class StaffProfile extends Component {
  constructor(props) {
    super(props);
    this.uploadedImage = React.createRef(null);
    this.imageUploader = React.createRef(null);
    this._isMounted = false;
    this.state = {
      staffID: "",
      sImage: defaultImg,
      sTitle: "",
      sFname: "",
      sLname: "",
      sDesignation: "",
      email: "",
      sPhone: "",
      sAddress: "",

      results: null,
      clickOnNewImage: false,

      oldPassword: "",
      newPassword: "",
      newPassword2: "",
    };
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  static propTypes = {
    addStaff: PropTypes.func.isRequired,
    staffs: PropTypes.array.isRequired,
    updateStaff: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
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
        sImage: e.target.files[0],
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

    const {
      staffID,
      sImage,
      sTitle,
      sFname,
      sLname,
      sDesignation,
      sPhone,
      sAddress,
      clickOnNewImage,
    } = this.state;

    let form_data = new FormData();

    form_data.append("user", staffID);

    if (clickOnNewImage == true) {
      form_data.append("sImage", sImage, sImage.name);
    } else {
      if (sImage == defaultImg) {
        const config = { responseType: "blob" };
        await axios.get(sImage, config).then((response) => {
          const img = new File(
            [response.data],
            `StaffProfileDefaultImage${staffID}`
          );
          const blob = new Blob([img], { type: "image/png" });
          form_data.append("sImage", blob, "Default.png");
        });
      }
    }

    form_data.append("sTitle", sTitle);
    form_data.append("sFname", sFname);
    form_data.append("sLname", sLname);
    form_data.append("sDesignation", sDesignation);
    form_data.append("sPhone", sPhone);
    form_data.append("sAddress", sAddress);

    for (var pair of form_data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    this.props.updateStaff(staffID, form_data);
  };

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      try {
        this._isMounted && (await this.props.getStaffs());
        this._isMounted &&
          this.setState({
            staffID: this.props.staffs[0].user,
            sImage: this.props.staffs[0].sImage,
            sTitle: this.props.staffs[0].sTitle,
            sFname: this.props.staffs[0].sFname,
            sLname: this.props.staffs[0].sLname,
            sDesignation: this.props.staffs[0].sDesignation,
            email: this.props.staffs[0].email,
            sPhone: this.props.staffs[0].sPhone,
            sAddress: this.props.staffs[0].sAddress,
            results: true,
          });
      } catch {}
    }
  }

  componentWillUnmount() {
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
      .post("/api/auth/staff_login", body, config)
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
      sImage,
      sTitle,
      sFname,
      sLname,
      sDesignation,
      email,
      sPhone,
      sAddress,
      oldPassword,
      newPassword,
      newPassword2,
    } = this.state;

    return (
      <Fragment>
        <div
          className="bg-gra-02 font-poppins"
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
                            {sImage == null || sImage == defaultImg ? (
                              <img
                                src={defaultImg}
                                ref={this.uploadedImage}
                                className="picture-src defPic"
                                id="wizardPicturePreview"
                                title=""
                              />
                            ) : (
                              <img
                                src={`${this.state.sImage}`}
                                ref={this.uploadedImage}
                                className="picture-src"
                                id="wizardPicturePreview"
                                title=""
                              />
                            )}
                          </div>
                          <input
                            type="file"
                            id="sImage"
                            accept="image/*"
                            onChange={this.handleImageUpload}
                            ref={this.imageUploader}
                            name="sImage"
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

                          {(sImage != null &&
                            typeof sImage == "string" &&
                            sImage.substring(0, defaultImgUrlLength) !=
                              defaultImg.substring(0, defaultImgUrlLength)) ||
                          (sImage != null &&
                            typeof sImage == "object" &&
                            sImage != defaultImg) ? (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm py-0 ml-1 mr-1"
                              style={{ fontSize: "0.7em" }}
                              onClick={() =>
                                this.setState({
                                  sImage: defaultImg,
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
                        <label htmlFor="sTitle">Title</label>
                        <select
                          className="form-control form-control-sm"
                          id="sTitle"
                          name="sTitle"
                          onChange={this.onChange}
                          value={sTitle}
                          required
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
                          name="sFname"
                          defaultValue={sFname}
                          disabled={true}
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
                          name="sLname"
                          defaultValue={sLname}
                          disabled={true}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-12">
                      <div className="form-group ">
                        <label htmlFor="InputDesignation">Designation</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="InputDesignation"
                          placeholder="Designation"
                          name="sDesignation"
                          onChange={this.onChange}
                          value={sDesignation}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-12">
                      <div className="form-group ">
                        <label htmlFor="inputEmail">Email Address</label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          id="inputEmail"
                          name="email"
                          defaultValue={email}
                          disabled={true}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row row-space">
                    <div className="col-md-12">
                      <div className="form-group ">
                        <label htmlFor="inputPhone">Contact Number</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          id="inputPhone"
                          placeholder="Contact Number"
                          name="sPhone"
                          onChange={this.onChange}
                          value={sPhone}
                          required
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
                          name="sAddress"
                          onChange={this.onChange}
                          value={sAddress}
                          required
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
  staffs: state.staffs.staffs,
  auth: state.auth,
});

export default compose(
  withAlert(),
  connect(mapStateToProps, {
    addStaff,
    getStaffs,
    updateStaff,
  })
)(StaffProfile);
