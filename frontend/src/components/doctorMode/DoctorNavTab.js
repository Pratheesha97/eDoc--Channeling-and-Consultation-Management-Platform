import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import DoctorProfile from "./DoctorProfile";
import DoctorPendingAppoints from "./DoctorPendingAppoints";
import CompletedAppointments from "./CompletedAppointments";

import "./css/doctorMode.css";
import WorkSchedule from "./WorkSchedule";
import Earnings from "./Earnings";
import Overview from "./Overview";

function TabPanel(props) {
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
export default function ScrollableTabsButtonAuto(props) {
  const { match, history } = props;
  const { params } = match;
  const { page } = params;

  const tabNameToIndex = {
    0: "overview",
    1: "profile",
    2: "pending_appointments",
    3: "completed_appointments",
    4: "work_schedule",
    5: "earnings",
  };

  const indexToTabName = {
    overview: 0,
    profile: 1,
    pending_appointments: 2,
    completed_appointments: 3,
    work_schedule: 4,
    earnings: 5,
  };

  const classes = useStyles();
  const [value, setValue] = useState(indexToTabName[page]);

  useEffect(() => {
    setValue(indexToTabName[page]);
  });

  const handleChange = (event, newValue) => {
    history.push(`/doctor_home/${tabNameToIndex[newValue]}`);
    setValue(newValue);
  };

  return (
    <Fragment>
      <div className="doctor-heading"> </div>
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
                  <span className={classes.tabLabel}>Pending Appointments</span>
                }
                {...a11yProps(2)}
              />
              <Tab
                label={
                  <span className={classes.tabLabel}>
                    Completed Appointments
                  </span>
                }
                {...a11yProps(3)}
              />
              <Tab
                label={<span className={classes.tabLabel}>Work Schedule</span>}
                {...a11yProps(4)}
              />
              <Tab
                label={<span className={classes.tabLabel}>Earnings</span>}
                {...a11yProps(5)}
              />
            </Tabs>
          </AppBar>
        </div>
        <TabPanel
          value={value}
          index={0}
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <Overview />
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <DoctorProfile />
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <DoctorPendingAppoints />
        </TabPanel>
        <TabPanel
          value={value}
          index={3}
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <CompletedAppointments />
        </TabPanel>
        <TabPanel
          value={value}
          index={4}
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <WorkSchedule />
        </TabPanel>
        <TabPanel
          value={value}
          index={5}
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <Earnings />
        </TabPanel>
      </div>
    </Fragment>
  );
}
