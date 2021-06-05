import React from "react";
import SearchBar from "material-ui-search-bar";
import CustomFooter from "./CustomFooter";
import DropDownOptions from "./DropDownOptions";
import { doctorRegister } from "../../actions/auth";
import { createMessage } from "../../actions/messages";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateDoctorNoToken, getDoctorsNoToken } from "../../actions/doctors";
import { authUserDeleteNoToken } from "../../actions/auth";
import { getAppointmentsNoToken } from "../../actions/appointments";
import MUIDataTable from "mui-datatables";
import {
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  Box,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { withAlert } from "react-alert";
import { compose } from "redux";

var doctorInfoDisplay = [];
var doctorInfo;
var appointmentList = [];
var docNationality;
var docGender;
var docIdentification;
var docQualifications;
var docChargePerSession;
var joinedDate;
var count;

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/frontend/src/components/staffMode/images/Default.png";

class DoctorInfo extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.uploadedImage = React.createRef(null);
    this.imageUploader = React.createRef(null);
    this.state = {
      doctorID: "",
      doctorImage: defaultImg,
      first_name: "",
      last_name: "",
      doctorGender: "",
      doctorNationality: "",
      doctorIdentification: "",
      Specialization: "",
      Qualifications: "",
      chargePerSession: "",
      email: "",
      doctorPhone: "",
      password: "",
      password2: "",
      results: null,
      clickOnNewImage: false,
      doctorInfoDisplay: [],
      viewNationalityOptions: true,
      viewSpecializationSuggests: true,
    };

    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  static propTypes = {
    updateDoctorNoToken: PropTypes.func.isRequired,
    doctors: PropTypes.array.isRequired,
    appointments: PropTypes.array.isRequired,
    authUserDeleteNoToken: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    doctorInfoDisplay = [];
    this._isMounted = false;
  }

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

  onRegFormSubmit = async (e) => {
    e.preventDefault();
    const alert = this.props.alert;
    const { first_name, last_name, email, password, password2 } = this.state;

    if (password !== password2) {
      this.props.createMessage({ passwordNotMatch: "Passwords do not match" });
    } else if (
      first_name == "" ||
      last_name == "" ||
      (first_name == "" && last_name == "")
    ) {
      this.props.createMessage({
        passwordNotMatch: "Name fields may not be blank",
      });
    } else {
      const newUser = {
        first_name,
        last_name,
        email,
        password,
      };
      var IdentificationDuplicate = false;
      var emailDuplicate = false;
      for (let j = 0; j < doctorInfo.length; j++) {
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
        }
      }
      if (IdentificationDuplicate == false && emailDuplicate == false) {
        await this.props.doctorRegister(newUser, this.fetchDoctorInfo);
        this.componentDidMount();
      } else if (IdentificationDuplicate == true) {
        alert.error("A user with this NIC/Passport Number already exists");
      } else if (emailDuplicate == true) {
        alert.error("A user with this email address already exists");
      }
    }
  };

  fetchDoctorInfo = async () => {
    const {
      doctorID,
      doctorImage,
      first_name,
      last_name,
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

    await this.props.getDoctorsNoToken();
    doctorInfo = this.props.doctors;
    for (let i = 0; i < doctorInfo.length; i++) {
      if (doctorInfo[i].email == email) {
        let form_data = new FormData();

        form_data.append("user", doctorInfo[i].user);

        if (clickOnNewImage == true) {
          form_data.append("doctorImage", doctorImage, doctorImage.name);
        } else {
          if (doctorImage != defaultImg) {
            const config = { responseType: "blob" };
            axios
              .get(doctorImage, config)
              .then((response) => {
                const img = new File(
                  [response.data],
                  `DoctorProfileImage${doctorInfo[i].user}`
                );
                form_data.append("doctorImage", img, img.name);
              })
              .catch((err) => console.log(err));
          }
        }

        form_data.append("doctorFName", first_name);
        form_data.append("doctorLName", last_name);
        form_data.append("doctorGender", doctorGender);
        form_data.append("doctorNationality", doctorNationality);
        form_data.append("doctorIdentification", doctorIdentification);
        form_data.append("Specialization", Specialization);
        form_data.append("Qualifications", Qualifications);
        form_data.append("chargePerSession", chargePerSession);
        form_data.append("email", email);
        form_data.append("doctorPhone", doctorPhone);
        for (var pair of form_data.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        await this.props.updateDoctorNoToken(
          this.props.doctors[i].user,
          form_data
        );
      }
    }
  };

  resetDocRegForm = () => {
    this.setState({
      doctorID: "",
      doctorImage: defaultImg,
      first_name: "",
      last_name: "",
      doctorGender: "",
      doctorNationality: "",
      doctorIdentification: "",
      Specialization: "",
      Qualifications: "",
      chargePerSession: "",
      email: "",
      doctorPhone: "",
      password: "",
      password2: "",
    });
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

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      this._isMounted &&
        this.setState({
          results: true,
        });

      this._isMounted && (await this.props.getDoctorsNoToken());
      doctorInfo = this.props.doctors;
      var list = [];
      doctorInfoDisplay = [];
      for (let j = 0; j < doctorInfo.length; j++) {
        list = [
          <img
            className=".img-responsive"
            src={
              doctorInfo[j].doctorImage == null
                ? defaultImg
                : `${doctorInfo[j].doctorImage}`
            }
            style={{
              height: "50px",
              width: "50px",
              borderRadius: "50%",
            }}
          />,

          doctorInfo[j].user,
          "Dr. " + doctorInfo[j].doctorFName + " " + doctorInfo[j].doctorLName,
          doctorInfo[j].Specialization,
          doctorInfo[j].email,
          doctorInfo[j].doctorPhone,
          <div>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => this.confirmationAlert(doctorInfo[j].user)}
            >
              −
            </button>
          </div>,
        ];
        if (list.length != 0) {
          doctorInfoDisplay.push(list);
        }
      }

      this._isMounted &&
        this.setState({
          doctorInfoDisplay: doctorInfoDisplay,
        });

      this._isMounted && (await this.props.getAppointmentsNoToken());
      appointmentList = this.props.appointments;
    }
  }

  doctorMoreInfo = (userID) => {
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
    for (let i = 0; i < doctorInfo.length; i++) {
      if (doctorInfo[i].user == userID) {
        docNationality = doctorInfo[i].doctorNationality;
        docGender = doctorInfo[i].doctorGender;
        docIdentification = doctorInfo[i].doctorIdentification;
        docQualifications = doctorInfo[i].Qualifications;
        docChargePerSession = doctorInfo[i].chargePerSession;
        joinedDate = `${new Date(doctorInfo[i].created_at).getDate()}-${
          monthNames[new Date(doctorInfo[i].created_at).getMonth()]
        }-${new Date(doctorInfo[i].created_at).getFullYear()}`;
        count = 0;
        for (let j = 0; j < appointmentList.length; j++) {
          if (
            appointmentList[j].doctorID == userID &&
            appointmentList[j].status == "COMPLETED"
          ) {
            count += 1;
          }
        }
      }
    }
  };

  confirmationAlert = (userID) => {
    confirmAlert({
      title: "Account Deletion!",
      message: "Are you sure you want to delete this Account? ",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await this.props.authUserDeleteNoToken(userID);
            this.componentDidMount();
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  render() {
    const {
      doctorID,
      doctorImage,
      first_name,
      last_name,
      doctorGender,
      doctorNationality,
      doctorIdentification,
      Specialization,
      Qualifications,
      chargePerSession,
      email,
      doctorPhone,
      password,
      password2,
      results,
      viewNationalityOptions,
      viewSpecializationSuggests,
    } = this.state;

    const {
      showing,
      SearchValue,
      SearchValueStartObject,
      SearchValueEndObject,
    } = this.state;
    const columns = [
      { label: "", options: { filter: false, sort: false } },
      { label: "Doctor ID", options: { filter: true, sort: true } },
      { label: "Name", options: { filter: true, sort: false } },
      { label: "Specialization", options: { filter: true, sort: false } },
      { label: "Email Address", options: { filter: true, sort: false } },
      { label: "Contact No", options: { filter: true, sort: false } },
      { label: "", options: { filter: false, sort: false } },
    ];

    const rows = this.state.doctorInfoDisplay;

    const options = {
      filterType: "dropdown",
      //responsive: "scroll",
      responsive: "standard",
      selectableRows: "none",
      expandableRows: true,
      expandableRowsHeader: false,
      expandableRowsOnClick: false,
      rowsPerPage: 20,
      rowsPerPageOptions: [1, 2, 4, 5, 10],
      customFooter: (
        count,
        page,
        rowsPerPage,
        changeRowsPerPage,
        changePage,
        textLabels
      ) => {
        return (
          <CustomFooter
            totalRows={rows.length}
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            changeRowsPerPage={changeRowsPerPage}
            changePage={changePage}
            textLabels={textLabels}
          />
        );
      },

      renderExpandableRow: (rowData) => (
        //GET ROW DATA, FETCH PATIENTID AND THEN DISPLAY PATIENT DETAILS IN EXPANDABLE ROW using (customBodyRender:)

        <React.Fragment>
          {this.doctorMoreInfo(rowData[1])}
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
              <Box margin={1}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Nationality</TableCell>
                      <TableCell align="center">Gender</TableCell>
                      <TableCell align="center">Identification No</TableCell>
                      <TableCell align="center">Qualifications</TableCell>
                      <TableCell align="center">
                        Channelling Fee (LKR)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <React.Fragment>
                      <TableRow>
                        <TableCell align="center">{docNationality}</TableCell>
                        <TableCell align="center">{docGender}</TableCell>
                        <TableCell align="center">
                          {docIdentification}
                        </TableCell>
                        <TableCell align="center">
                          {docQualifications}
                        </TableCell>
                        <TableCell align="center">
                          {docChargePerSession}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={8}>
                          <span style={{ fontSize: "12px", color: "green" }}>
                            Successful Appointments: &nbsp;
                            {count}
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={8}>
                          <span style={{ fontSize: "12px", color: "blue" }}>
                            Date joined: &nbsp;
                            {joinedDate}
                          </span>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  </TableBody>
                </Table>
              </Box>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ),
    };

    return (
      <React.Fragment>
        {/*============================= Completed Appointments card ======================================================== */}
        <div
          style={{
            width: "950px",
            margin: "0 auto",
            paddingTop: "50px",
            position: "relative",
            //zIndex: "1",
            paddingBottom: "25px",
          }}
        >
          {/*=============================================Add New Doctor ========================================================= */}

          <button
            type="button"
            className="btn btn-primary mb-4"
            data-toggle="modal"
            data-target="#docSignUp"
          >
            + Add New Doctor Account
          </button>

          <div
            className="modal fade"
            id="docSignUp"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">
                    Doctor Registration Form
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {/*=============================================== Doc Register Form ================================================= */}
                  <form onSubmit={this.onRegFormSubmit}>
                    <div className="row row-space">
                      <div className="form-group" style={{ margin: "0 auto" }}>
                        <div className="picture-container">
                          <div className="picture">
                            <div
                              onClick={() => this.imageUploader.current.click()}
                            >
                              {doctorImage == defaultImg ||
                              doctorImage == null ? (
                                <img
                                  src={defaultImg}
                                  ref={this.uploadedImage}
                                  className="picture-src"
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
                          <div className="pt-2 pb-4">
                            <button
                              type="button"
                              className="btn btn-dark btn-sm py-0"
                              onClick={() => this.imageUploader.current.click()}
                              style={{ fontSize: "0.7em" }}
                            >
                              Change Profile Picture
                            </button>
                            {doctorImage != defaultImg ? (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm py-0 ml-1 mr-1"
                                style={{ fontSize: "0.7em" }}
                                onClick={() => {
                                  this.setState({
                                    doctorImage: defaultImg,
                                    clickOnNewImage: false,
                                  });
                                }}
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
                      <div className="col-md-6">
                        <div className="form-group ">
                          <label htmlFor="inputFname">First Name</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="inputFname"
                            name="first_name"
                            onChange={this.onChange}
                            value={first_name}
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
                            name="last_name"
                            onChange={this.onChange}
                            value={last_name}
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
                                checked={
                                  doctorGender == "Female" ? true : false
                                }
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
                              bookDoctorSpecialization={
                                this.doctorSpecialization
                              }
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
                          <label
                            htmlFor="inputEmail"
                            style={{ textTransform: "initial" }}
                          >
                            Email Address (Use this email address to login)
                          </label>
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            id="inputEmail"
                            placeholder="Email"
                            name="email"
                            onChange={this.onChange}
                            value={email}
                            autoComplete="new-password"
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
                      <div className="col-md-6">
                        <div className="form-group ">
                          <label htmlFor="inputPassword1">Enter Password</label>
                          <input
                            type="password"
                            className="form-control form-control-sm"
                            id="inputPassword1"
                            name="password"
                            onChange={this.onChange}
                            value={password}
                            required
                            autoComplete="new-password"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group ">
                          <label htmlFor="inputPassword2">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            className="form-control form-control-sm"
                            id="inputPassword2"
                            name="password2"
                            onChange={this.onChange}
                            value={password2}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={this.resetDocRegForm}
                      >
                        Reset
                      </button>
                      <button type="submit" className="btn btn-primary btn-sm">
                        Save changes
                      </button>
                    </div>
                  </form>
                </div>
                {/*=====================================================================================================================*/}
              </div>
            </div>
          </div>

          <MUIDataTable
            title={"Doctor Information"}
            data={rows}
            columns={columns}
            options={options}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  doctors: state.doctors.doctors,
  appointments: state.appointments.appointments,
});

export default compose(
  withAlert(),
  connect(mapStateToProps, {
    doctorRegister,
    createMessage,
    updateDoctorNoToken,
    getDoctorsNoToken,
    getAppointmentsNoToken,
    authUserDeleteNoToken,
  })
)(DoctorInfo);
