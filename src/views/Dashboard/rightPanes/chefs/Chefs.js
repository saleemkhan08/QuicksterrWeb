import React, { Component } from "react";
import CRUDList from "../../../CrudList";
import PropTypes from "prop-types";
import {
  fetchChefs,
  addChefs,
  deleteChefs
} from "../../../../actions/chefsActions";
import { CHEF_DETAILS } from "../../../../actions/navigationActions";
import { connect } from "react-redux";
import AddChefDialog from "./AddChefDialog";

class Chefs extends Component {
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
    const { chefs } = this.props.reducer.chefs;
    if (chefs === undefined) {
      const { restaurantId } = this.props;
      this.props.dispatch(fetchChefs(restaurantId));
    }
  }
  render() {
    const { chefs, isLoading } = this.props.reducer;
    const crudItems = this.getCrudItemsFromChefs(chefs);
    return (
      <div>
        <CRUDList
          items={crudItems}
          detail={CHEF_DETAILS}
          isLoading={isLoading}
          handleAdd={this.handleAdd}
          handleDelete={this.handleDelete}
          hideEdit
        />
        <AddChefDialog
          open={this.state.openAddDialog}
          handleAddSave={this.handleAddSave}
          handleCancel={this.handleCancel}
        />
      </div>
    );
  }
  getCrudItemsFromChefs(chefs) {
    if (chefs) {
      const items = [];
      for (let i = 0; i < chefs.length; i++) {
        let item = {};
        item.name = chefs[i].name;
        item.icon = chefs[i].photoUrl;
        item.description = chefs[i].email;
        item.link = "#";
        item.id = chefs[i].uid;
        item.object = chefs[i].email;
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
    this.props.dispatch(addChefs(this.props.restaurantId, email));
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
    this.props.dispatch(deleteChefs(email));
  }
}
const mapStateToProps = state => {
  return {
    reducer: state.ChefsReducer
  };
};
Chefs.propTypes = {
  restaurantId: PropTypes.string,
  dispatch: PropTypes.func,
  reducer: PropTypes.object,
  heading: PropTypes.string
};

export default connect(mapStateToProps)(Chefs);
