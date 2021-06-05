import React from "react";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import MuiTablePagination from "@material-ui/core/TablePagination";
import { withStyles } from "@material-ui/core/styles";

const defaultFooterStyles = {};

class CustomFooterforEarningTable extends React.Component {
  handleRowChange = (event) => {
    this.props.changeRowsPerPage(event.target.value);
  };

  handlePageChange = (_, page) => {
    this.props.changePage(page);
  };

  render() {
    const { count, classes, textLabels, rowsPerPage, page } = this.props;

    const footerStyle = {
      display: "flex",
      justifyContent: "flex-end",
      padding: "0px 24px 0px 24px",
    };

    return (
      <TableFooter>
        <TableRow>
          <TableCell style={footerStyle} colSpan={1000}>
            <MuiTablePagination
              component="div"
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              labelRowsPerPage={textLabels.rowsPerPage}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${textLabels.displayRows} ${count}`
              }
              backIconButtonProps={{
                "aria-label": textLabels.previous,
              }}
              nextIconButtonProps={{
                "aria-label": textLabels.next,
              }}
              rowsPerPageOptions={[1, 2, 3, 4, 5, 10]}
              onChangePage={this.handlePageChange}
              onChangeRowsPerPage={this.handleRowChange}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <div style={{ backgroundColor: "#bed3f3" }}>
            <h6>
              <TableCell>
                <b>Number of Appointments:</b>
              </TableCell>
              <TableCell>
                <span style={{ color: "#dc3545" }}>{this.props.totalRows}</span>
              </TableCell>
            </h6>
          </div>
        </TableRow>
        <TableRow>
          <div style={{ backgroundColor: "#8ED1FC" }}>
            <TableCell>Total Income:</TableCell>
            <TableCell> 30000.00 LKR </TableCell>
          </div>
        </TableRow>
      </TableFooter>
    );
  }
}

export default withStyles(defaultFooterStyles, { name: "CustomFooter" })(
  CustomFooterforEarningTable
);
