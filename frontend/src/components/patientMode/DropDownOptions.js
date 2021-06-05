import React, { Fragment, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

const useStyles = makeStyles({
  option: {
    fontSize: 13,
    "& > span": {
      marginRight: 10,
      fontSize: 12,
    },
  },
});

export default function DropDownOptions(props) {
  const classes = useStyles();
  const [doctorNameList, setDoctorNameList] = useState([]);
  const [patientNameList, setPatientNameList] = useState([]);

  var doctorList = [];
  var patientList = [];

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (props.viewDoctorNameSuggests) {
        isMounted &&
          axios.get("/api/doctorNonAuth").then((res) => {
            const doctors = res.data;
            while (doctorList.length > 0) {
              doctorList.splice(0, 1);
            }
            for (let i = 0; i < doctors.length; i++) {
              doctorList.push({
                doctorId: `${doctors[i].user}`,
                label: `Dr. ${doctors[i].doctorFName} ${doctors[i].doctorLName}`,
                specialization: `${doctors[i].Specialization}`,
              });
              isMounted && setDoctorNameList(doctorList);
            }
          });
      }
      if (props.viewPatientInfo) {
        isMounted &&
          axios.get("/api/patientNonAuth").then((res) => {
            const patients = res.data;
            while (patientList.length > 0) {
              patientList.splice(0, 1);
            }
            for (let i = 0; i < patients.length; i++) {
              patientList.push({
                label: `${patients[i].user} - ${patients[i].fname} ${patients[i].lname}`,
              });
              isMounted && setPatientNameList(patientList);
            }
          });
      }
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Fragment>
      {props.viewNationalityOptions ? (
        <Autocomplete
          id="country-select-demo"
          size="small"
          name="doctorNationality"
          defaultValue={{ label: props.country }}
          options={countries}
          onChange={(event, value) => {
            props.countrySelect(value);
          }}
          classes={{
            option: classes.option,
          }}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(option) => (
            <React.Fragment>{option.label}</React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label=""
              size="small"
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password",
                style: { fontSize: "14px", padding: "1px" },
              }}
            />
          )}
        />
      ) : props.viewDoctorNameSuggests ? (
        <Autocomplete
          id="country-select-demo"
          size="small"
          name="doctorNationality"
          value={{
            doctorId: props.docIdDefault,
            label: props.docNameDefault,
            specialization: props.doctorSpecDefault,
          }}
          options={doctorNameList}
          onChange={(event, value) => {
            props.bookDoctorName(value);
          }}
          classes={{
            option: classes.option,
          }}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(option) => (
            <React.Fragment>{option.label}</React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label=""
              size="small"
              variant="outlined"
              placeholder="Doctor (Any)"
              inputProps={{
                ...params.inputProps,
                autoComplete: "off",
                style: { fontSize: "14px", padding: "1px" },
              }}
            />
          )}
        />
      ) : props.viewSpecializationSuggests ? (
        <Autocomplete
          id="specialty-select-demo"
          size="small"
          name="doctorSpecialty"
          defaultValue={{
            label: props.doctorSpecDefault,
          }}
          value={{ label: props.doctorSpecDefault }}
          options={specializations}
          onChange={(event, value) => {
            props.bookDoctorSpecialization(value);
          }}
          classes={{
            option: classes.option,
          }}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(option) => (
            <React.Fragment>{option.label}</React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label=""
              size="small"
              variant="outlined"
              placeholder={
                props.channelHistory
                  ? "Filter by Specialization"
                  : "Specialization (Any)"
              }
              inputProps={{
                ...params.inputProps,
                autoComplete: "off",
                style: { fontSize: "14px", padding: "1px" },
              }}
            />
          )}
        />
      ) : props.viewPatientNationality ? (
        <Autocomplete
          id="country-select-demo1"
          size="small"
          name="patientNationality"
          value={{ label: props.patientCountry }}
          options={countries}
          onChange={(event, value) => {
            props.patientCountrySelect(value);
          }}
          classes={{
            option: classes.option,
          }}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(option) => (
            <React.Fragment>{option.label}</React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label=""
              size="small"
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password",
                style: { fontSize: "14px", padding: "1px" },
              }}
            />
          )}
        />
      ) : props.viewPatientInfo ? (
        <Autocomplete
          id="patient-select-demo"
          size="small"
          name="patientDetails"
          options={patientNameList}
          onChange={(event, value) => {
            props.bookPatientName(value);
          }}
          classes={{
            option: classes.option,
          }}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(option) => (
            <React.Fragment>{option.label}</React.Fragment>
          )}
          required
          renderInput={(params) => (
            <TextField
              {...params}
              label=""
              size="small"
              variant="outlined"
              placeholder=""
              inputProps={{
                ...params.inputProps,
                autoComplete: "off",
                style: { fontSize: "14px", padding: "1px" },
              }}
            />
          )}
        />
      ) : (
        ""
      )}
    </Fragment>
  );
}

const countries = [
  { label: "" },
  { label: "Andorra" },
  { label: "United Arab Emirates" },
  { label: "Afghanistan" },
  { label: "Antigua and Barbuda" },
  { label: "Anguilla" },
  { label: "Albania" },
  { label: "Armenia" },
  { label: "Angola" },
  { label: "Antarctica" },
  { label: "Argentina" },
  { label: "American Samoa" },
  { label: "Austria" },
  { label: "Australia" },
  { label: "Aruba" },
  { label: "Alland Islands" },
  { label: "Azerbaijan" },
  { label: "Bosnia and Herzegovina" },
  { label: "Barbados" },
  { label: "Bangladesh" },
  { label: "Belgium" },
  { label: "Burkina Faso" },
  { label: "Bulgaria" },
  { label: "Bahrain" },
  { label: "Burundi" },
  { label: "Benin" },
  { label: "Saint Barthelemy" },
  { label: "Bermuda" },
  { label: "Brunei Darussalam" },
  { label: "Bolivia" },
  { label: "Brazil" },
  { label: "Bahamas" },
  { label: "Bhutan" },
  { label: "Bouvet Island" },
  { label: "Botswana" },
  { label: "Belarus" },
  { label: "Belize" },
  { label: "Canada" },
  { label: "Cocos (Keeling) Islands" },
  { label: "Congo, Democratic Republic of the" },
  { label: "Central African Republic" },
  { label: "Congo, Republic of the" },
  { label: "Switzerland" },
  { label: "Cote d'Ivoire" },
  { label: "Cook Islands" },
  { label: "Chile" },
  { label: "Cameroon" },
  { label: "China" },
  { label: "Colombia" },
  { label: "Costa Rica" },
  { label: "Cuba" },
  { label: "Cape Verde" },
  { label: "Curacao" },
  { label: "Christmas Island" },
  { label: "Cyprus" },
  { label: "Czech Republic" },
  { label: "Germany" },
  { label: "Djibouti" },
  { label: "Denmark" },
  { label: "Dominica" },
  { label: "Dominican Republic" },
  { label: "Algeria" },
  { label: "Ecuador" },
  { label: "Estonia" },
  { label: "Egypt" },
  { label: "Western Sahara" },
  { label: "Eritrea" },
  { label: "Spain" },
  { label: "Ethiopia" },
  { label: "Finland" },
  { label: "Fiji" },
  { label: "Falkland Islands (Malvinas)" },
  { label: "Micronesia, Federated States of" },
  { label: "Faroe Islands" },
  { label: "France" },
  { label: "Gabon" },
  { label: "United Kingdom" },
  { label: "Grenada" },
  { label: "Georgia" },
  { label: "French Guiana" },
  { label: "Guernsey" },
  { label: "Ghana" },
  { label: "Gibraltar" },
  { label: "Greenland" },
  { label: "Gambia" },
  { label: "Guinea" },
  { label: "Guadeloupe" },
  { label: "Equatorial Guinea" },
  { label: "Greece" },
  { label: "South Georgia and the South Sandwich Islands" },
  { label: "Guatemala" },
  { label: "Guam" },
  { label: "Guinea-Bissau" },
  { label: "Guyana" },
  { label: "Hong Kong" },
  { label: "Heard Island and McDonald Islands" },
  { label: "Honduras" },
  { label: "Croatia" },
  { label: "Haiti" },
  { label: "Hungary" },
  { label: "Indonesia" },
  { label: "Ireland" },
  { label: "Israel" },
  { label: "Isle of Man" },
  { label: "India" },
  { label: "British Indian Ocean Territory" },
  { label: "Iraq" },
  { label: "Iran, Islamic Republic of" },
  { label: "Iceland" },
  { label: "Italy" },
  { label: "Jersey" },
  { label: "Jamaica" },
  { label: "Jordan" },
  { label: "Japan" },
  { label: "Kenya" },
  { label: "Kyrgyzstan" },
  { label: "Cambodia" },
  { label: "Kiribati" },
  { label: "Comoros" },
  { label: "Saint Kitts and Nevis" },
  { label: "Korea, Democratic People's Republic of" },
  { label: "Korea, Republic of" },
  { label: "Kuwait" },
  { label: "Cayman Islands" },
  { label: "Kazakhstan" },
  { label: "Lao People's Democratic Republic" },
  { label: "Lebanon" },
  { label: "Saint Lucia" },
  { label: "Liechtenstein" },
  { label: "Sri Lanka" },
  { label: "Liberia" },
  { label: "Lesotho" },
  { label: "Lithuania" },
  { label: "Luxembourg" },
  { label: "Latvia" },
  { label: "Libya" },
  { label: "Morocco" },
  { label: "Monaco" },
  { label: "Moldova, Republic of" },
  { label: "Montenegro" },
  { label: "Saint Martin (French part)" },
  { label: "Madagascar" },
  { label: "Marshall Islands" },
  { label: "Macedonia, the Former Yugoslav Republic of" },
  { label: "Mali" },
  { label: "Myanmar" },
  { label: "Mongolia" },
  { label: "Macao" },
  { label: "Northern Mariana Islands" },
  { label: "Martinique" },
  { label: "Mauritania" },
  { label: "Montserrat" },
  { label: "Malta" },
  { label: "Mauritius" },
  { label: "Maldives" },
  { label: "Malawi" },
  { label: "Mexico" },
  { label: "Malaysia" },
  { label: "Mozambique" },
  { label: "Namibia" },
  { label: "New Caledonia" },
  { label: "Niger" },
  { label: "Norfolk Island" },
  { label: "Nigeria" },
  { label: "Nicaragua" },
  { label: "Netherlands" },
  { label: "Norway" },
  { label: "Nepal" },
  { label: "Nauru" },
  { label: "Niue" },
  { label: "New Zealand" },
  { label: "Oman" },
  { label: "Panama" },
  { label: "Peru" },
  { label: "French Polynesia" },
  { label: "Papua New Guinea" },
  { label: "Philippines" },
  { label: "Pakistan" },
  { label: "Poland" },
  { label: "Saint Pierre and Miquelon" },
  { label: "Pitcairn" },
  { label: "Puerto Rico" },
  { label: "Palestine, State of" },
  { label: "Portugal" },
  { label: "Palau" },
  { label: "Paraguay" },
  { label: "Qatar" },
  { label: "Reunion" },
  { label: "Romania" },
  { label: "Serbia" },
  { label: "Russian Federation" },
  { label: "Rwanda" },
  { label: "Saudi Arabia" },
  { label: "Solomon Islands" },
  { label: "Seychelles" },
  { label: "Sudan" },
  { label: "Sweden" },
  { label: "Singapore" },
  { label: "Saint Helena" },
  { label: "Slovenia" },
  { label: "Svalbard and Jan Mayen" },
  { label: "Slovakia" },
  { label: "Sierra Leone" },
  { label: "San Marino" },
  { label: "Senegal" },
  { label: "Somalia" },
  { label: "Suriname" },
  { label: "South Sudan" },
  { label: "Sao Tome and Principe" },
  { label: "El Salvador" },
  { label: "Sint Maarten (Dutch part)" },
  { label: "Syrian Arab Republic" },
  { label: "Swaziland" },
  { label: "Turks and Caicos Islands" },
  { label: "Chad" },
  { label: "French Southern Territories" },
  { label: "Togo" },
  { label: "Thailand" },
  { label: "Tajikistan" },
  { label: "Tokelau" },
  { label: "Timor-Leste" },
  { label: "Turkmenistan" },
  { label: "Tunisia" },
  { label: "Tonga" },
  { label: "Turkey" },
  { label: "Trinidad and Tobago" },
  { label: "Tuvalu" },
  { label: "Taiwan, Province of China" },
  { label: "United Republic of Tanzania" },
  { label: "Ukraine" },
  { label: "Uganda" },
  { label: "United States" },
  { label: "Uruguay" },
  { label: "Uzbekistan" },
  { label: "Holy See (Vatican City State)" },
  { label: "Saint Vincent and the Grenadines" },
  { label: "Venezuela" },
  { label: "British Virgin Islands" },
  { label: "US Virgin Islands" },
  { label: "Vietnam" },
  { label: "Vanuatu" },
  { label: "Wallis and Futuna" },
  { label: "Samoa" },
  { label: "Kosovo" },
  { label: "Yemen" },
  { label: "Mayotte" },
  { label: "South Africa" },
  { label: "Zambia" },
  { label: "Zimbabwe" },
];

const specializations = [
  { label: "Allergist" },
  { label: "Anaesthesiologist" },
  { label: "Andrologist" },
  { label: "Cardiologist" },
  { label: "Cardiac Electrophysiologist" },
  { label: "Dermatologist" },
  { label: "Dietitian/Dietician" },
  { label: "Emergency Room (ER) Doctors" },
  { label: "Endocrinologist" },
  { label: "Epidemiologist" },
  { label: "Family Medicine Physician" },
  { label: "Gastroenterologist" },
  { label: "Geriatrician" },
  { label: "Hyperbaric Physician" },
  { label: "Hematologist" },
  { label: "Hepatologist" },
  { label: "Immunologist" },
  { label: "Infectious Disease Specialist" },
  { label: "Intensivist" },
  { label: "Internal Medicine Specialist" },
  { label: "Maxillofacial Surgeon / Oral Surgeon" },
  { label: "Medical Examiner" },
  { label: "Medical Geneticist" },
  { label: "Neonatologist" },
  { label: "Nephrologist" },
  { label: "Neurologist" },
  { label: "Neurosurgeon" },
  { label: "Nuclear Medicine Specialist" },
  { label: "Obstetrician/Gynecologist (OB/GYN)" },
  { label: "Occupational Medicine Specialist" },
  { label: "Oncologist" },
  { label: "Ophthalmologist" },
  { label: "Orthopedic Surgeon / Orthopedist" },
  { label: "Otolaryngologist (also ENT Specialist)" },
  { label: "Osteopath" },
  { label: "Parasitologist" },
  { label: "Pathologist" },
  { label: "Pathologist" },
  { label: "Perinatologist" },
  { label: "Periodontist" },
  { label: "Pediatrician" },
  { label: "Physiatrist" },
  { label: "Plastic Surgeon" },
  { label: "Psychiatrist" },
  { label: "Pulmonologist" },
  { label: "Radiologist" },
  { label: "Rheumatologist" },
  { label: "Sleep Doctor / Sleep Disorders Specialist" },
  { label: "Spinal Cord Injury Specialist" },
  { label: "Sports Medicine Specialist" },
  { label: "Surgeon" },
  { label: "Thoracic Surgeon" },
  { label: "Urologist" },
  { label: "Vascular Surgeon" },
  //{label:"Veterinarian"},
  { label: "Palliative Care Specialist" },
];
