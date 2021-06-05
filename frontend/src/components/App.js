import React, { Component, Fragment, lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import "core-js/stable";
import "regenerator-runtime/runtime";
import Alerts from "./layout/Alerts";
import { Provider } from "react-redux"; //Connecting react to redux via this Provider
import store from "../store";
import { loadUser } from "../actions/auth";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import loadingImg from "../components/guestUserMode/images/loadingImg.gif";

//Alert Options
const alertOptions = {
  timeout: 5000, //3000 milliseconds = 3 seconds.
  position: "top center",
  containerStyle: {
    zIndex: 99999,
  },
};

const Navbar = lazy(() => import("./layout/Navbar"));
const NavTab = lazy(() => import("./patientMode/NavTab"));
const StaffNavTab = lazy(() => import("./staffMode/StaffNavTab"));
const DoctorNavTab = lazy(() => import("./doctorMode/DoctorNavTab"));
const PrivateRoute = lazy(() => import("./common/PrivateRoute"));
const Homepage = lazy(() => import("./guestUserMode/Homepage"));

class App extends Component {
  componentDidMount() {
    var fullPath = location.pathname + location.search + location.hash;
    if (fullPath != "/#/") {
      store.dispatch(loadUser()); //OR in componentWillUnmount() {this.auth.user.logout()}
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      isDoctorMode: false,
      showSignInComponent: false,
      showSignUpComponent: false,
      isStaffMode: false,
    };

    this.patientSignInComponent = this.patientSignInComponent.bind(this);
    this.signUpComponent = this.signUpComponent.bind(this);
  }

  patientSignInComponent() {
    this.setState({
      isDoctorMode: false,
      showSignInComponent: true,
      showSignUpComponent: false,
      isStaffMode: false,
    });
  }

  signUpComponent() {
    this.setState({
      isDoctorMode: false,
      showSignInComponent: false,
      showSignUpComponent: true,
      isStaffMode: false,
    });
  }

  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Suspense
              fallback={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: "100vh",
                  }}
                >
                  <h2
                    className="w-100 text-center"
                    style={{
                      color: "gray",
                    }}
                  >
                    Loading...
                    <br />
                    <img
                      className="mt-5"
                      src={loadingImg}
                      height="300"
                      width="400"
                    />
                  </h2>
                </div>
              }
            >
              <Fragment>
                <Navbar
                  signUpSwitch={this.signUpComponent}
                  signInOutSwitch={this.patientSignInComponent}
                  isDoctorMode={this.state.isDoctorMode}
                  isStaffMode={this.state.isStaffMode}
                />
                <Alerts />
                <Switch>
                  <Redirect exact from="/home" to="/home/overview" />
                  <Redirect
                    exact
                    from="/staff_home"
                    to="/staff_home/overview"
                  />
                  <Redirect
                    exact
                    from="/doctor_home"
                    to="/doctor_home/overview"
                  />
                  <PrivateRoute
                    exact
                    path="/home/:page?"
                    component={(props) => <NavTab {...props} />}
                  />
                  <PrivateRoute
                    exact
                    path="/staff_home/:page?"
                    component={(props) => <StaffNavTab {...props} />}
                  />
                  <PrivateRoute
                    exact
                    path="/doctor_home/:page?"
                    component={(props) => <DoctorNavTab {...props} />}
                  />
                  <Route
                    exact
                    path="/"
                    component={() => (
                      <Homepage
                        isDoctorMode={this.state.isDoctorMode}
                        signInOutSwitch={this.patientSignInComponent}
                        showSignInComponent={this.state.showSignInComponent}
                        showSignUpComponent={this.state.showSignUpComponent}
                        isStaffMode={this.state.isStaffMode}
                      />
                    )}
                  />
                  <Route
                    path="/admin"
                    component={() => {
                      location.href = "/admin";
                      return null;
                    }}
                  />
                </Switch>
              </Fragment>
            </Suspense>
          </Router>
        </AlertProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
