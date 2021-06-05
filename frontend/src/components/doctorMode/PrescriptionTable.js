import { duration } from "@material-ui/core";
import React, { Component } from "react";

export class PrescriptionTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [
        {
          drugName: "",
          duration: { howMany: 0, DWM: "Days" },
          dosage: { morn: "0", aft: "0", eve: "0", night: "0" },
          instructions: "Not Specified",
          notes: "",
        },
      ],
    };
  }

  handleChange = (idx) => (e) => {
    const { name, value } = e.target;
    let rows = [...this.state.rows];
    let row = { ...rows[idx] };
    if (name === "drugName") {
      row.drugName = value;
    } else if (name === "howMany") {
      ((row || {}).duration || {}).howMany = value;
    } else if (name === "DWM") {
      ((row || {}).duration || {}).DWM = value;
    } else if (name === "morning") {
      ((row || {}).dosage || {}).morn = value;
    } else if (name === "afternoon") {
      ((row || {}).dosage || {}).aft = value;
    } else if (name === "evening") {
      ((row || {}).dosage || {}).eve = value;
    } else if (name === "night") {
      ((row || {}).dosage || {}).night = value;
    } else if (name === "instructions") {
      row.instructions = value;
    } else if (name === "notes") {
      row.notes = value;
    }
    rows[idx] = row;
    this.setState({ rows });
  };

  componentDidUpdate() {
    this.props.setPrescripRows(this.state.rows);
  }

  handleAddRow = (event) => {
    const item = {
      drugName: "",
      duration: {
        howMany: 0,
        DWM: "Days",
      },
      dosage: {
        morn: "0",
        aft: "0",
        eve: "0",
        night: "0",
      },
      instructions: "Not Specified",
      notes: "",
    };
    this.setState({
      rows: [...this.state.rows, item],
    });
    event.preventDefault();
  };

  handleRemoveRow = (event) => {
    this.setState({
      rows: this.state.rows.slice(0, -1),
    });
    event.preventDefault();
  };
  handleRemoveSpecificRow = (idx) => (event) => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows });
    event.preventDefault();
  };
  render() {
    return (
      <div>
        <div className="modal-body">
          <table className="table table-sm table-hover" id="tab_logic">
            <thead className="thead-light">
              <tr style={{ fontSize: "13px" }}>
                <th scope="col" className="text-center">
                  #
                </th>
                <th scope="col" className="text-center">
                  Drug Name
                </th>
                <th scope="col" className="text-center">
                  Duration
                </th>
                <th scope="col" className="text-center">
                  Dosage
                </th>
                <th scope="col" className="text-center">
                  Instructions
                </th>
                <th scope="col" className="text-center">
                  Notes
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.rows.map((item, idx) => (
                <tr id="addr0" key={idx}>
                  <th style={{ fontSize: "12px" }} scope="row">
                    {idx + 1}
                  </th>
                  <td>
                    <input
                      type="text"
                      name="drugName"
                      value={this.state.rows[idx].drugName}
                      onChange={this.handleChange(idx)}
                      className="form-control form-control-sm"
                      style={{ fontSize: "12px" }}
                    />
                  </td>
                  <td>
                    <div className="row">
                      <div className="form-group col-sm-2 ml-4 mr-0">
                        <input
                          type="number"
                          name="howMany"
                          value={
                            ((this.state.rows[idx] || {}).duration || {})
                              .howMany
                          }
                          onChange={this.handleChange(idx)}
                          className="form-control form-control-sm"
                          style={{ width: "40px", fontSize: "12px" }}
                        />
                      </div>
                      <div className="form-group col-sm-2 ml-1 mr-0">
                        <select
                          className="form-control form-control-sm"
                          name="DWM"
                          value={
                            ((this.state.rows[idx] || {}).duration || {}).DWM
                          }
                          id="sel1"
                          style={{ width: "85px", fontSize: "12px" }}
                          onChange={this.handleChange(idx)}
                        >
                          <option>Days</option>
                          <option>Weeks</option>
                          <option>Months</option>
                        </select>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="row">
                      <div className="form-group col-xs-1 ml-0 mr-0">
                        <select
                          className="form-control form-control-sm"
                          id="sel1"
                          style={{ width: "60px", fontSize: "12px" }}
                          name="morning"
                          value={
                            ((this.state.rows[idx] || {}).dosage || {}).morn
                          }
                          onChange={this.handleChange(idx)}
                        >
                          <option>0</option>
                          <option>1/2</option>
                          <option>1</option>
                          <option>2</option>
                        </select>{" "}
                      </div>{" "}
                      -
                      <div className="form-group col-xs-1 ml-0 mr-0">
                        <select
                          className="form-control form-control-sm"
                          id="sel1"
                          style={{ width: "60px", fontSize: "12px" }}
                          name="afternoon"
                          value={
                            ((this.state.rows[idx] || {}).dosage || {}).aft
                          }
                          onChange={this.handleChange(idx)}
                        >
                          <option>0</option>
                          <option>1/2</option>
                          <option>1</option>
                          <option>2</option>
                        </select>{" "}
                      </div>{" "}
                      -
                      <div className="form-group col-xs-1 ml-0 mr-0">
                        <select
                          className="form-control form-control-sm"
                          id="sel1"
                          style={{ width: "60px", fontSize: "12px" }}
                          name="evening"
                          value={
                            ((this.state.rows[idx] || {}).dosage || {}).eve
                          }
                          onChange={this.handleChange(idx)}
                        >
                          <option>0</option>
                          <option>1/2</option>
                          <option>1</option>
                          <option>2</option>
                        </select>{" "}
                      </div>{" "}
                      -
                      <div className="form-group col-xs-1 ml-0 mr-0">
                        <select
                          className="form-control form-control-sm"
                          id="sel1"
                          style={{ width: "60px", fontSize: "12px" }}
                          name="night"
                          value={
                            ((this.state.rows[idx] || {}).dosage || {}).night
                          }
                          onChange={this.handleChange(idx)}
                        >
                          <option>0</option>
                          <option>1/2</option>
                          <option>1</option>
                          <option>2</option>
                        </select>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      className="form-control form-control-sm"
                      id="sel1"
                      style={{ fontSize: "12px" }}
                      name="instructions"
                      value={this.state.rows[idx].instructions}
                      onChange={this.handleChange(idx)}
                    >
                      <option>Not Specified</option>
                      <option>Before meal</option>
                      <option>After meal</option>
                    </select>
                  </td>
                  <td>
                    <textarea
                      name="notes"
                      value={this.state.rows[idx].notes}
                      onChange={this.handleChange(idx)}
                      className="form-control form-control-sm"
                      rows="2"
                      style={{ fontSize: "12px" }}
                    ></textarea>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm "
                      onClick={this.handleRemoveSpecificRow(idx)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={this.handleAddRow} className="btn btn-info btn-sm">
            + Add New Row
          </button>
          <button
            onClick={this.handleRemoveRow}
            className="btn btn-danger float-right btn-sm"
          >
            Delete Last Row
          </button>
        </div>
      </div>
    );
  }
}

export default PrescriptionTable;
