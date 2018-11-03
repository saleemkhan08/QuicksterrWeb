import React, { Component } from "react";
import {
  fetchTables,
  editTables,
  addTables,
  deleteTables
} from "../../../../actions/tablesActions";
import { TABLE_DETAILS } from "../../../../actions/authActions";
import { connect } from "react-redux";
import CRUDList from "../../../CrudList";
import TableAddDialog from "./TableAddDialog";
import TableEditDialog from "./TableEditDialog";
import PropTypes from "prop-types";
class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openEditDialog: false,
      openAddDialog: false,
      table: undefined
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEditSave = this.handleEditSave.bind(this);
    this.handleAddSave = this.handleAddSave.bind(this);
  }

  componentDidMount() {
    const { tables } = this.props.reducer.tables;
    if (tables === undefined) {
      this.props.dispatch(fetchTables(this.props.restaurantId));
    }
  }
  render() {
    const { tables } = this.props.reducer;
    const crudItems = this.getCrudItemsFromTables(tables);

    return (
      <div>
        <CRUDList
          items={crudItems}
          detail={TABLE_DETAILS}
          isLoading={this.props.reducer.isLoading}
          handleEdit={this.handleEdit}
          handleAdd={this.handleAdd}
          handleDelete={this.handleDelete}
        />
        <TableAddDialog
          open={this.state.openAddDialog}
          handleAddSave={this.handleAddSave}
          handleCancel={this.handleCancel}
        />
        <TableEditDialog
          open={this.state.openEditDialog}
          handleEditSave={this.handleEditSave}
          handleCancel={this.handleCancel}
          table={this.state.table}
        />
      </div>
    );
  }

  getCrudItemsFromTables(tables) {
    if (tables) {
      const items = [];
      for (let i = 0; i < tables.length; i++) {
        let item = {};
        item.name = tables[i].name;
        item.icon = tables[i].icon;
        item.description = tables[i].description;
        item.link = "#";
        item.id = tables[i].id;
        item.object = tables[i];
        items.push(item);
      }
      return items;
    }
  }
  handleAdd() {
    this.setState({
      openEditDialog: false,
      openAddDialog: true,
      table: undefined
    });
  }

  handleEditSave(table) {
    this.props.dispatch(editTables(this.props.restaurantId, table));
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      table: undefined
    });
  }
  handleAddSave(table) {
    this.props.dispatch(addTables(this.props.restaurantId, table));
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      table: undefined
    });
  }

  handleCancel() {
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      table: undefined
    });
  }

  handleDelete(table) {
    this.props.dispatch(deleteTables(this.props.restaurantId, table));
  }

  handleEdit(table) {
    this.setState({
      openEditDialog: true,
      openAddDialog: false,
      table: table
    });
  }
}

const mapStateToProps = state => {
  return {
    reducer: state.TablesReducer
  };
};

Tables.propTypes = {
  restaurantId: PropTypes.string,
  heading: PropTypes.string,
  dispatch: PropTypes.func,
  reducer: PropTypes.object
};

export default connect(mapStateToProps)(Tables);
