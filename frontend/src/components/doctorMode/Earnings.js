import React, { Component, Fragment } from "react";
import SearchBar from "material-ui-search-bar";
import { Line } from "react-chartjs-2";
import DateRangePickerFunction from "./DateRangePickerFunction";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAppointmentsNoToken } from "../../actions/appointments";
import { setDate } from "date-fns";

var earningsDisplay = [];
var rowCount = 0;
var totIncome = 0;
export class Earnings extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      docID: this.props.auth.user.id,
      showing: false,
      SearchValue: "",
      SearchValueStartObject: {},
      SearchValueEndObject: {},
      showVisitedPage: false,
      earningsDisplay: [],
      chartLabels: [],
      chartData: [],
    };

    this.setSearchValue = this.setSearchValue.bind(this);
  }

  static propTypes = {
    appointments: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
  };

  async setSearchValue(startDate, endDate) {
    this._isMounted &&
      (await this.setState({
        SearchValue: `${startDate.getDate()}-${
          startDate.getMonth() + 1 > 9
            ? `${startDate.getMonth() + 1}`
            : `0${startDate.getMonth() + 1}`
        }-${startDate.getFullYear()} to ${endDate.getDate()}-${
          endDate.getMonth() + 1 > 9
            ? `${endDate.getMonth() + 1}`
            : `0${endDate.getMonth() + 1}`
        }-${endDate.getFullYear()}`,
        SearchValueStartObject: startDate,
        SearchValueEndObject: endDate,
      }));

    const appointmentInfo = this.props.appointments;
    earningsDisplay = [];
    rowCount = 0;
    totIncome = 0;
    for (let i = 0; i < appointmentInfo.length; i++) {
      var tempDate = new Date(appointmentInfo[i].date);
      tempDate.setHours(0, 0, 0);
      if (
        appointmentInfo[i].doctorID == this.state.docID &&
        appointmentInfo[i].status == "COMPLETED" &&
        ((tempDate >= this.state.SearchValueStartObject &&
          tempDate <= this.state.SearchValueEndObject) ||
          (tempDate == this.state.SearchValueStartObject) ==
            this.state.SearchValueEndObject)
      ) {
        var obj = {
          date: tempDate,
          ReferenceID: appointmentInfo[i].ReferenceID,
          PatientID: appointmentInfo[i].patientID,
          income: appointmentInfo[i].ChannellingFee,
        };
        earningsDisplay.unshift(obj);
        rowCount += 1;
        const fee = +appointmentInfo[i].ChannellingFee;
        totIncome += fee;
      }
    }
    this._isMounted &&
      this.setState({
        earningsDisplay: earningsDisplay,
      });
    this._isMounted && this.setChart(startDate, endDate, earningsDisplay);
  }

  setChart = (startDate, endDate, earningsDisplay) => {
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

    var tempStartDate = new Date(startDate);
    var tempEndDate = new Date(endDate);

    var labelList = [];
    var labelListPureDate = [];
    const labelLength = Math.ceil(
      Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24) + 1
    );

    for (let n = 0; n < labelLength; n++) {
      if (tempStartDate <= tempEndDate) {
        labelListPureDate.push(tempStartDate);
        labelList.push(
          `${tempStartDate.getDate()}-${monthNames[tempStartDate.getMonth()]}`
        );
      }
      var temp = new Date(tempStartDate);
      tempStartDate = new Date(temp.setDate(temp.getDate() + 1));
    }

    this._isMounted &&
      this.setState({
        chartLabels: labelList,
      });

    var income = 0;
    var dataList = [];
    for (let m = 0; m < labelListPureDate.length; m++) {
      income = 0;
      for (let p = 0; p < earningsDisplay.length; p++) {
        if (
          labelListPureDate[m].toString() == earningsDisplay[p].date.toString()
        ) {
          income += earningsDisplay[p].income * 1;
        }
      }
      dataList.push(income);
    }
    this._isMounted &&
      this.setState({
        chartData: dataList,
      });
    if (this.refs.chart != undefined) {
      const { datasets } = this.refs.chart.chartInstance.data;
    }
  };

  closeChild = (e) => {
    this.setState({
      showing: false,
    });
  };

  componentWillUnmount() {
    earningsDisplay = [];
    rowCount = 0;
    totIncome = 0;
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this._isMounted && (await this.props.getAppointmentsNoToken());

      var temp = new Date();
      temp.setDate(temp.getDate() - 6);
      temp.setHours(0, 0, 0);

      this._isMounted && this.setSearchValue(temp, new Date());
    }
  }

  render() {
    const {
      showing,
      SearchValue,
      SearchValueStartObject,
      SearchValueEndObject,
    } = this.state;

    var data = {
      labels: this.state.chartLabels,
      datasets: [
        {
          label: "Income (LKR)",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,

          data: this.state.chartData,
        },
      ],
    };
    return (
      <Fragment>
        <div className="pt-5 pb-5">
          <div
            className="card w-50"
            style={{
              margin: "0 auto",
              boxShadow: "0px 8px 20px 0px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div className="card-header">
              {/*=============================================Search Bar========================================================= */}
              <div style={{ paddingTop: "40px" }}>
                <SearchBar
                  onChange={() => console.log("onChange")}
                  value={SearchValue}
                  onClick={() => this.setState({ showing: !showing })}
                  onRequestSearch={() => console.log("onRequestSearch")}
                  style={{ width: "410px", margin: "0 auto", fontSize: "5px" }}
                  placeholder="Search by Date"
                  readOnly
                />
                {showing ? (
                  <div className="mt-5">
                    {this.state.showing && (
                      <DateRangePickerFunction
                        SearchValue={this.setSearchValue}
                        onClose={this.closeChild}
                        currentSearchValue={SearchValue}
                        SearchValueStartObject={SearchValueStartObject}
                        SearchValueEndObject={SearchValueEndObject}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            {this.state.earningsDisplay.length != 0 ? (
              <div className="card-body">
                <h6>
                  <br></br>
                  <table className="table table-bordered table-sm">
                    <tbody>
                      <tr>
                        <th>Date</th>
                        <th>Reference ID</th>
                        <th>Patient ID</th>
                        <th>Income (LKR)</th>
                      </tr>
                      {this.state.earningsDisplay.map((earnings, index) => {
                        return (
                          <tr key={index}>
                            <td>{`${earnings.date.getDate()}.${
                              earnings.date.getMonth() + 1 > 9
                                ? `${earnings.date.getMonth() + 1}`
                                : `0${earnings.date.getMonth() + 1}`
                            }.${earnings.date.getFullYear()}`}</td>
                            <td>{earnings.ReferenceID}</td>
                            <td>{earnings.PatientID}</td>
                            <td>{earnings.income}</td>
                          </tr>
                        );
                      })}

                      <tr style={{ backgroundColor: "#8ED1FC" }}>
                        <td
                          colSpan={3}
                          className="text-right"
                          style={{
                            borderRightStyle: "hidden",
                            backgroundColor: "#bed3f3",
                          }}
                        >
                          <b>Total Number of Appointments:</b>
                        </td>
                        <td>
                          <b>{rowCount}</b>
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: "#8ED1FC" }}>
                        <td
                          colSpan={3}
                          className="text-right"
                          style={{
                            borderRightStyle: "hidden",
                            backgroundColor: "#bed3f3",
                          }}
                        >
                          <b>Total Income:</b>
                        </td>
                        <td>
                          <b>{totIncome} LKR</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </h6>
                {this.state.chartLabels.length != 0 ? (
                  <div>
                    <Line ref="chart" data={data} />
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="card-body">
                <h3 className="text-center mt-5 mb-5" style={{ color: "gray" }}>
                  No Appointments Found...{" "}
                </h3>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  appointments: state.appointments.appointments,
});

export default connect(mapStateToProps, {
  getAppointmentsNoToken,
})(Earnings);
