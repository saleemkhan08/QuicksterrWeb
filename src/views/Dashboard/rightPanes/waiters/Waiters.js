import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  fetchWaiters,
  addWaiters,
  deleteWaiters
} from "../../../../actions/waitersActions";
import { WAITER_DETAILS } from "../../../../actions/navigationActions";
import { connect } from "react-redux";
import CRUDList from "../../../CrudList";
import AddWaiterDialog from "./AddWaiterDialog";
class Waiters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddDialog: false
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAddSave = this.handleAddSave.bind(this);
  }
  componentDidMount() {
    const { waiters } = this.props.reducer.waiters;
    if (waiters === undefined) {
      const { restaurantId } = this.props;
      this.props.dispatch(fetchWaiters(restaurantId));
    }
  }
  render() {
    const { waiters, isLoading } = this.props.reducer;
    const crudItems = this.getCrudItemsFromWaiters(waiters);
    return (
      <div>
        <CRUDList
          items={crudItems}
          detail={WAITER_DETAILS}
          isLoading={isLoading}
          handleAdd={this.handleAdd}
          handleDelete={this.handleDelete}
          hideEdit
        />
        <AddWaiterDialog
          open={this.state.openAddDialog}
          handleAddSave={this.handleAddSave}
          handleCancel={this.handleCancel}
        />
      </div>
    );
  }
  getCrudItemsFromWaiters(waiters) {
    if (waiters) {
      const items = [];
      for (let i = 0; i < waiters.length; i++) {
        let item = {};
        item.name = waiters[i].name;
        item.icon = waiters[i].photoUrl;
        item.description = waiters[i].email;
        item.link = "#";
        item.id = waiters[i].uid;
        item.object = waiters[i].email;
        items.push(item);
      }
      return items;
    }
  }

  handleAdd() {
    this.setState({
      openAddDialog: true
    });
  }

  handleAddSave(email) {
    this.props.dispatch(addWaiters(this.props.restaurantId, email));
    this.setState({
      openAddDialog: false
    });
  }

  handleCancel() {
    this.setState({
      openAddDialog: false
    });
  }

  handleDelete(email) {
    this.props.dispatch(deleteWaiters(email));
  }
}

const mapStateToProps = state => {
  return {
    reducer: state.WaitersReducer
  };
};

Waiters.propTypes = {
  restaurantId: PropTypes.string,
  dispatch: PropTypes.func,
  reducer: PropTypes.object,
  heading: PropTypes.string
};

export default connect(mapStateToProps)(Waiters);
