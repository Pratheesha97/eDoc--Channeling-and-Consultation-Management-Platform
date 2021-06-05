import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PatientProfile from "./PatientProfile";
import BookAppointment from "./BookAppointment";
import UpcomingAppointments from "./UpcomingAppointments";
import ChannellingHistory from "./ChannellingHistory";
import PatientOverview from "./PatientOverview";
import "./css/patientMode.css";
import PrivateRoute from "../common/PrivateRoute";

import {
  Link,
  Redirect,
  Switch,
  useParams,
  useHistory,
} from "react-router-dom";

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box span={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    backgroundColor: "black",
    color: "white",
    justifyContent: "center",
  },
  tabLabel: {
    textTransform: "initial",
    fontFamily: "Raleway",
    fontWeight: "700",
  },
}));

function ScrollableTabsButtonAuto(props) {
  const { match, history } = props;
  const { params } = match;
  const { page } = params;

  const tabNameToIndex = {
    0: "overview",
    1: "profile",
    2: "book_appointment",
    3: "upcoming_appointments",
    4: "channelling_history",
  };

  const indexToTabName = {
    overview: 0,
    profile: 1,
    book_appointment: 2,
    upcoming_appointments: 3,
    channelling_history: 4,
  };

  const classes = useStyles();
  const [value, setValue] = useState(indexToTabName[page]);

  useEffect(() => {
    setValue(indexToTabName[page]);
  });

  const handleChange = (event, newValue) => {
    history.push(`/home/${tabNameToIndex[newValue]}`);
    setValue(newValue);
  };

  return (
    <Fragment>
      <div className="registered-patient-heading"></div>
      <div className={classes.root}>
        <div className="sticky">
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              textColor="inherit"
              className={classes.tabs}
            >
              <Tab
                label={<span className={classes.tabLabel}>Overview</span>}
                {...a11yProps(0)}
              />
              <Tab
                label={<span className={classes.tabLabel}>My Profile</span>}
                {...a11yProps(1)}
              />
              <Tab
                label={
                  <span className={classes.tabLabel}>Book Appointment</span>
                }
                {...a11yProps(2)}
              />
              <Tab
                label={
                  <span className={classes.tabLabel}>
                    Upcoming Appointments
                  </span>
                }
                {...a11yProps(3)}
              />
              <Tab
                label={
                  <span className={classes.tabLabel}>Channelling History</span>
                }
                {...a11yProps(4)}
              />
            </Tabs>
          </AppBar>
        </div>

        <TabPanel
          value={value}
          index={0}
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <PatientOverview />
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <PatientProfile />
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <BookAppointment />
        </TabPanel>
        <TabPanel
          value={value}
          index={3}
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <UpcomingAppointments />
        </TabPanel>
        <TabPanel
          value={value}
          index={4}
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <ChannellingHistory />
        </TabPanel>
      </div>
    </Fragment>
  );
}

export default ScrollableTabsButtonAuto;
