import React from "react";
import SearchBar from "material-ui-search-bar";
import CustomFooter from "./CustomFooter";
import DropDownOptions from "./DropDownOptions";
import { patientRegisterByStaff } from "../../actions/auth";
import { createMessage } from "../../actions/messages";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  updatePatientNoToken,
  getPatientsNoToken,
} from "../../actions/patients";
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

var patientInfoDisplay = [];
var patientInfo;
var appointmentList = [];
var patientNationality;
var patientGender;
var patientDOB;
var patientAddress;
var joinedDate;
var successCount;
var noShowCount;

const defaultImg =
  window.location.protocol +
  "//" +
  window.location.host +
  "/frontend/src/components/staffMode/images/Default.png";

class PatientInfo extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.uploadedImage = React.createRef(null);
    this.imageUploader = React.createRef(null);
    this.state = {
      patientID: "",
      patientImage: defaultImg,
      title: "",
      first_name: "",
      last_name: "",
      gender: "",
      Identification: "",
      dob: "",
      Nationality: "",
      Address: "",
      email: "",
      phone: "",
      password: "",
      password2: "",
      results: null,
      clickOnNewImage: false,
      patientInfoDisplay: [],
      viewNationalityOptions: true,
      viewSpecializationSuggests: true,
    };

    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  static propTypes = {
    updatePatientNoToken: PropTypes.func.isRequired,
    patients: PropTypes.array.isRequired,
    appointments: PropTypes.array.isRequired,
    authUserDeleteNoToken: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    patientInfoDisplay = [];
    this._isMounted = false;
  }

  countrySelect = (Nationality) => {
    if (Nationality != null) {
      this.setState({ Nationality: Nationality.label });
    } else {
      this.setState({ Nationality: "" });
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
      for (let j = 0; j < patientInfo.length; j++) {
        if (
          patientInfo[j].Identification != null &&
          patientInfo[j].Identification != "" &&
          patientInfo[j].email != null
        ) {
          if (
            this.state.Identification.toLowerCase() ==
            patientInfo[j].Identification.toLowerCase()
          ) {
            IdentificationDuplicate = true;
          }
          if (
            this.state.email.toLowerCase() == patientInfo[j].email.toLowerCase()
          ) {
            emailDuplicate = true;
          }
        }
      }
      if (IdentificationDuplicate == false && emailDuplicate == false) {
        await this.props.patientRegisterByStaff(newUser, this.fetchPatientInfo);
        this.componentDidMount();
        alert.success("Patient Account Created Successfully!");
      } else if (IdentificationDuplicate == true) {
        alert.error("A user with this NIC/Passport Number already exists");
      } else if (emailDuplicate == true) {
        alert.error("A user with this email address already exists");
      }
    }
  };

  fetchPatientInfo = async () => {
    const {
      patientID,
      patientImage,
      title,
      first_name,
      last_name,
      gender,
      Identification,
      dob,
      Nationality,
      Address,
      email,
      phone,
      clickOnNewImage,
    } = this.state;

    await this.props.getPatientsNoToken();
    patientInfo = this.props.patients;
    for (let i = 0; i < patientInfo.length; i++) {
      if (patientInfo[i].email == email) {
        let form_data = new FormData();

        form_data.append("user", patientInfo[i].user);

        if (clickOnNewImage == true) {
          form_data.append("patientImage", patientImage, patientImage.name);
        } else {
          if (patientImage != defaultImg) {
            const config = { responseType: "blob" };
            axios
              .get(patientImage, config)
              .then((response) => {
                const img = new File(
                  [response.data],
                  `PatientProfileImage${patientInfo[i].user}`
                );
                form_data.append("patientImage", img, img.name);
              })
              .catch((err) => console.log(err));
          }
        }

        form_data.append("title", title);
        form_data.append("fname", first_name);
        form_data.append("lname", last_name);
        form_data.append("gender", gender);
        form_data.append("Identification", Identification);
        form_data.append("dob", dob);
        form_data.append("Nationality", Nationality);
        form_data.append("Address", Address);
        form_data.append("email", email);
        form_data.append("phone", phone);
        for (var pair of form_data.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        await this.props.updatePatientNoToken(
          this.props.patients[i].user,
          form_data
        );
      }
    }
  };

  resetPatientRegForm = () => {
    this.setState({
      patientID: "",
      patientImage: defaultImg,
      title: "",
      first_name: "",
      last_name: "",
      gender: "",
      Identification: "",
      dob: "",
      Nationality: "",
      Address: "",
      email: "",
      phone: "",
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

      this._isMounted && (await this.props.getPatientsNoToken());
      patientInfo = this.props.patients;
      var list = [];
      patientInfoDisplay = [];
      for (let j = 0; j < patientInfo.length; j++) {
        list = [
          <img
            className=".img-responsive"
            src={
              patientInfo[j].patientImage == null
                ? defaultImg
                : `${patientInfo[j].patientImage}`
            }
            style={{
              height: "50px",
              width: "50px",
              borderRadius: "50%",
            }}
          />,

          patientInfo[j].user,
          patientInfo[j].title == null ||
          patientInfo[j].title == "" ||
          patientInfo[j].title == "-" ||
          patientInfo[j].title == "null"
            ? patientInfo[j].fname + " " + patientInfo[j].lname
            : patientInfo[j].title +
              " " +
              patientInfo[j].fname +
              " " +
              patientInfo[j].lname,
          patientInfo[j].Identification == null ||
          patientInfo[j].Identification == "" ||
          patientInfo[j].Identification == "null"
            ? "N/A"
            : patientInfo[j].Identification,
          patientInfo[j].email,
          patientInfo[j].phone == null ||
          patientInfo[j].phone == "" ||
          patientInfo[j].phone == "null"
            ? "N/A"
            : patientInfo[j].phone,
          <div>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => this.confirmationAlert(patientInfo[j].user)}
            >
              −
            </button>
          </div>,
        ];
        if (list.length != 0) {
          patientInfoDisplay.push(list);
        }
      }

      this._isMounted &&
        this.setState({
          patientInfoDisplay: patientInfoDisplay,
        });

      this._isMounted && (await this.props.getAppointmentsNoToken());
      appointmentList = this.props.appointments;
    }
  }

  patientMoreInfo = (userID) => {
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
    for (let i = 0; i < patientInfo.length; i++) {
      if (patientInfo[i].user == userID) {
        patientNationality = patientInfo[i].Nationality;
        patientGender = patientInfo[i].gender;
        patientDOB =
          patientInfo[i].dob == "null" || patientInfo[i].dob == null
            ? "N/A"
            : patientInfo[i].dob;
        patientAddress = patientInfo[i].Address;
        joinedDate = `${new Date(patientInfo[i].created_at).getDate()}-${
          monthNames[new Date(patientInfo[i].created_at).getMonth()]
        }-${new Date(patientInfo[i].created_at).getFullYear()}`;
        successCount = 0;
        noShowCount = 0;
        for (let j = 0; j < appointmentList.length; j++) {
          if (
            appointmentList[j].patientID == userID &&
            appointmentList[j].status == "COMPLETED"
          ) {
            successCount += 1;
          } else if (
            appointmentList[j].patientID == userID &&
            appointmentList[j].status == "DID NOT ATTEND"
          ) {
            noShowCount += 1;
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
      patientID,
      patientImage,
      title,
      first_name,
      last_name,
      gender,
      Identification,
      dob,
      Nationality,
      Address,
      email,
      phone,
      password,
      password2,
      results,
      clickOnNewImage,
      patientInfoDisplay,
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
      { label: "Patient ID", options: { filter: true, sort: true } },
      { label: "Name", options: { filter: true, sort: false } },
      { label: "NIC/Passport No", options: { filter: true, sort: false } },
      { label: "Email Address", options: { filter: true, sort: false } },
      { label: "Contact No", options: { filter: true, sort: false } },
      { label: "", options: { filter: false, sort: false } },
    ];

    const rows = this.state.patientInfoDisplay;

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
          {this.patientMoreInfo(rowData[1])}
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
              <Box margin={1}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Gender</TableCell>
                      <TableCell align="center">Date of Birth</TableCell>
                      <TableCell align="center">Nationality</TableCell>
                      <TableCell align="center">Address</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <React.Fragment>
                      <TableRow>
                        <TableCell align="center">
                          {patientGender == "" ? "N/A" : patientGender}
                        </TableCell>
                        <TableCell align="center">
                          {patientDOB == "" || patientDOB == null
                            ? "N/A"
                            : patientDOB}
                        </TableCell>
                        <TableCell align="center">
                          {patientNationality == ""
                            ? "N/A"
                            : patientNationality}
                        </TableCell>
                        <TableCell align="center">
                          {patientAddress == "" ? "N/A" : patientAddress}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={8}>
                          <span style={{ fontSize: "12px", color: "green" }}>
                            Total Visited Appointments: &nbsp;
                            {successCount}
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={8}>
                          <span style={{ fontSize: "12px", color: "red" }}>
                            Total No-Show Appointments: &nbsp;
                            {noShowCount}
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
            width: "1150px",
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
            + Add New Patient Account
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
                    Patient Registration Form
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
                              {patientImage == defaultImg ||
                              patientImage == null ? (
                                <img
                                  src={defaultImg}
                                  ref={this.uploadedImage}
                                  className="picture-src"
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
                          <div className="pt-2 pb-4">
                            <button
                              type="button"
                              className="btn btn-dark btn-sm py-0"
                              onClick={() => this.imageUploader.current.click()}
                              style={{ fontSize: "0.7em" }}
                            >
                              Change Profile Picture
                            </button>
                            {patientImage != defaultImg ? (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm py-0 ml-1 mr-1"
                                style={{ fontSize: "0.7em" }}
                                onClick={() => {
                                  this.setState({
                                    patientImage: defaultImg,
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
                            placeholder="Last Name"
                            name="last_name"
                            onChange={this.onChange}
                            value={last_name}
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
                            autoComplete="none"
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
                        onClick={this.resetPatientRegForm}
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
            title={"Patient Information"}
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
  patients: state.patients.patients,
  appointments: state.appointments.appointments,
});

export default compose(
  withAlert(),
  connect(mapStateToProps, {
    patientRegisterByStaff,
    createMessage,
    updatePatientNoToken,
    getPatientsNoToken,
    getAppointmentsNoToken,
    authUserDeleteNoToken,
  })
)(PatientInfo);
