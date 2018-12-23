import React, { Component } from "react";
import EditDialog from "../../../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  closeTableAndUserSetter,
  setTableAndUser,
  TAKE_AWAY
} from "../orders/ordersActions";
import "./MenuStyle.css";
import Paper from "@material-ui/core/Paper";
import GridContainer from "../../../../components/Grid/GridContainer";
import GridItem from "../../../../components/Grid/GridItem";
import { CenteredText } from "../../../../components/Centered/CenteredUtils";
import Switch from "@material-ui/core/Switch";

export class TableAndUserSetter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table: "",
      noOfPeople: 1,
      name: "",
      phoneNo: "",
      isTakeAway: false,
      tableError: ""
    };
  }

  handleChange = event => {
    if (event.target.id === "isTakeAway") {
      let tableError = this.state.tableError;
      if (!this.state.isTakeAway) {
        tableError = "";
      }
      this.setState({
        isTakeAway: !this.state.isTakeAway,
        tableError
      });
    } else {
      this.setState({
        [event.target.id]: event.target.value
      });
    }
  };

  getOccupiedTableIds = activeOrders => {
    let occupiedTables = [];
    activeOrders.forEach(order => {
      if (order.table !== TAKE_AWAY) {
        occupiedTables.push(order.table.id);
      }
    });
    return occupiedTables;
  };

  render() {
    const {
      openTableAndUserSetter,
      activeOrders,
      table
    } = this.props.orderReducer;

    const { tables } = this.props.tablesReducer;
    const { isTakeAway, name, phoneNo, noOfPeople } = this.state;
    const heading = "Table Details";
    const occupiedTableIds = this.getOccupiedTableIds(activeOrders);

    if (table && !this.state.table) {
      this.setState({
        table
      });
    }

    tables.forEach(table => {
      table["isAvailable"] = occupiedTableIds.indexOf(table.id) < 0;
    });

    return (
      <div>
        <EditDialog
          open={openTableAndUserSetter}
          heading={heading}
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        >
          <div className="takeAwaySwitch">
            <div className="takeAwayLable">
              {isTakeAway ? "Take Away" : "Dine-in"}
            </div>
            <Switch
              id="isTakeAway"
              checked={isTakeAway}
              onChange={this.handleChange}
              aria-label="LoginSwitch"
            />
          </div>
          <h4 className="error-text">{this.state.tableError}</h4>
          <GridContainer>
            {isTakeAway ? "" : this.showRows(tables)}
          </GridContainer>
          <TextField
            id="name"
            label="Name"
            margin="normal"
            fullWidth
            value={name}
            onChange={this.handleChange}
            className="inputFields"
          />
          <TextField
            id="phoneNo"
            label="Phone No."
            margin="normal"
            fullWidth
            value={phoneNo}
            onChange={this.handleChange}
            className="inputFields"
          />
          {isTakeAway ? (
            ""
          ) : (
            <TextField
              id="noOfPeople"
              label="Number of People"
              margin="normal"
              fullWidth
              value={noOfPeople}
              onChange={this.handleChange}
              className="inputFields"
            />
          )}
        </EditDialog>
      </div>
    );
  }

  showRows = items => {
    if (items.length > 0) {
      return items.map(item => {
        return this.getCard(item);
      });
    } else {
      return <CenteredText msg="No tables found" />;
    }
  };

  handleSave = () => {
    if (this.state.isTakeAway) {
      this.setState({
        table: ""
      });
    }
    if (this.state.table || this.state.isTakeAway) {
      this.props.dispatch(setTableAndUser(this.state));
      this.props.dispatch(closeTableAndUserSetter());
      this.setState({ table: "", noOfPeople: 1, isTakeAway: false });
    } else {
      this.setState({
        tableError: "Please select the table or if the order is a take away"
      });
    }
  };

  handleCancel = () => {
    this.props.dispatch(closeTableAndUserSetter());
  };

  getCard(item) {
    let bgColor = "#ffffff";
    let textColor = "#000000";
    if (!item.isAvailable) {
      bgColor = "#cccccc";
    } else if (this.state.table && item.id === this.state.table.id) {
      bgColor = "#3f51b5";
      textColor = "#ffffff";
    }

    return (
      <GridItem xs={6} sm={4} md={3} key={item.id}>
        <div>
          <Paper className="table-card">
            <div
              className="table-container"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className="table-textContainer"
                onClick={() => {
                  if (item.isAvailable) {
                    this.onLinkClick(item);
                  }
                }}
              >
                <p className="table-cardHeading" style={{ color: textColor }}>
                  {item.name}
                </p>
                <p
                  className="table-cardDescription"
                  style={{ color: textColor }}
                >
                  Capacity : {item.capacity}
                </p>
              </div>
            </div>
          </Paper>
        </div>
      </GridItem>
    );
  }

  onLinkClick(table) {
    this.setState({
      table,
      noOfPeople: table.capacity,
      tableError: ""
    });
  }
}
TableAndUserSetter.propTypes = {
  orderReducer: PropTypes.object,
  tablesReducer: PropTypes.object,
  dispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    orderReducer: state.OrderReducer,
    tablesReducer: state.TablesReducer
  };
};

export default connect(mapStateToProps)(TableAndUserSetter);
