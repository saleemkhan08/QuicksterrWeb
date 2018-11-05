import React, { Component } from "react";
import PropTypes from "prop-types";
import { fetchCategories } from "../../../../actions/menuActions";
import { connect } from "react-redux";
import CRUDList from "../../../CrudList";

import { CATEGORY_DETAILS } from "../../../../actions/authActions";
import {
  addCategories,
  editCategories,
  deleteCategories
} from "../../../../actions/menuActions";

import AddCategoryDialog from "./AddCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openEditDialog: false,
      openAddDialog: false,
      category: undefined
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEditSave = this.handleEditSave.bind(this);
    this.handleAddSave = this.handleAddSave.bind(this);
  }

  componentDidMount() {
    const { restaurantId } = this.props;
    this.props.dispatch(fetchCategories(restaurantId));
  }
  render() {
    const { categories, isLoading } = this.props.menuReducer;
    const crudItems = this.getCrudItemsFromCategories(categories);
    return (
      <div>
        <CRUDList
          items={crudItems}
          detail={CATEGORY_DETAILS}
          isLoading={isLoading}
          handleEdit={this.handleEdit}
          handleAdd={this.handleAdd}
          handleDelete={this.handleDelete}
        />
        {this.addAdminOptionsDialogs()}
      </div>
    );
  }
  addAdminOptionsDialogs() {
    if (this.props.authReducer.isAdmin)
      return (
        <div>
          <AddCategoryDialog
            open={this.state.openAddDialog}
            handleAddSave={this.handleAddSave}
            handleCancel={this.handleCancel}
          />
          <EditCategoryDialog
            open={this.state.openEditDialog}
            handleEditSave={this.handleEditSave}
            handleCancel={this.handleCancel}
            category={this.state.category}
          />
        </div>
      );
  }
  getCrudItemsFromCategories(categories) {
    if (categories) {
      const items = [];
      for (let i = 0; i < categories.length; i++) {
        let item = {};
        item.name = categories[i].name;
        item.icon = categories[i].icon;
        item.description = categories[i].description;
        item.link = "#";
        item.id = categories[i].id;
        item.object = categories[i];
        items.push(item);
      }
      return items;
    }
  }
  handleAdd() {
    this.setState({
      openEditDialog: false,
      openAddDialog: true,
      category: undefined
    });
  }
  handleEditSave(category) {
    this.props.dispatch(editCategories(this.props.restaurantId, category));
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      category: undefined
    });
  }
  handleAddSave(category) {
    this.props.dispatch(addCategories(this.props.restaurantId, category));
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      category: undefined
    });
  }
  handleCancel() {
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      category: undefined
    });
  }
  handleDelete(category) {
    this.props.dispatch(deleteCategories(this.props.restaurantId, category.id));
  }
  handleEdit(category) {
    this.setState({
      openEditDialog: true,
      openAddDialog: false,
      category: category
    });
  }
}
Category.propTypes = {
  restaurantId: PropTypes.string,
  dispatch: PropTypes.func,
  menuReducer: PropTypes.object,
  heading: PropTypes.string,
  authReducer: PropTypes.object,
  restaurantReducer: PropTypes.object
};
const mapStateToProps = state => {
  return {
    menuReducer: state.MenuReducer,
    authReducer: state.AuthReducer,
    restaurantReducer: state.RestaurantReducer
  };
};

export default connect(mapStateToProps)(Category);
