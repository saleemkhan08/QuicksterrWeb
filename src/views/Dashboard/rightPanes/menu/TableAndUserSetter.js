import React, { Component } from "react";
import EditDialog from "../../../../components/dialogs/EditDialog";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  closeTableAndUserSetter,
  setTableAndUser
} from "../../../../actions/ordersActions";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import "./MenuStyle.css";
export class TableAndUserSetter extends Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      table: "",
      customer: "",
      noOfPeople: 1
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { openTableAndUserSetter } = this.props.orderReducer;
    const { tables } = this.props.tablesReducer;
    const { table, customer, noOfPeople } = this.state;
    const heading = "Table and Customer Details";
    return (
      <div>
        <EditDialog
          open={openTableAndUserSetter}
          heading={heading}
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        >
          <FormControl className="table-select">
            <InputLabel htmlFor="table">Table</InputLabel>
            <Select
              value={table}
              onChange={this.handleSelectChange}
              inputProps={{
                name: "table",
                id: "table-simple"
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {tables.map(table => {
                return (
                  <MenuItem key={table.id} value={table.name}>
                    {table.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            id="customer"
            label="Customer Name"
            margin="normal"
            fullWidth
            value={customer}
            onChange={this.handleChange}
            className="inputFields"
          />
          <TextField
            id="noOfPeople"
            label="Number of People"
            margin="normal"
            fullWidth
            value={noOfPeople}
            onChange={this.handleChange}
            className="inputFields"
          />
        </EditDialog>
      </div>
    );
  }
  handleSave() {
    this.props.dispatch(
      setTableAndUser(
        this.state.table,
        this.state.customer,
        this.state.noOfPeople
      )
    );
    this.props.dispatch(closeTableAndUserSetter());
    this.setState({ table: "", customer: "", noOfPeople: 1 });
  }

  handleCancel = () => {
    this.props.dispatch(closeTableAndUserSetter());
  };
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
