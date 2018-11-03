import React, { Component } from "react";
import {
  fetchDishes,
  addDishes,
  editDishes,
  deleteDishes
} from "../../../../actions/dishesActions";
import { MENU_ITEM_DETAILS } from "../../../../actions/authActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CrudList from "../../../CrudList";
import DishAddDialog from "./DishAddDialog";
import DishEditDialog from "./DishEditDialog";

import {
  displayCategoriesTabs,
  hideCategoriesTabs
} from "../../../../actions/menuActions";
import TableAndUserSetter from "./TableAndUserSetter";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openEditDialog: false,
      openAddDialog: false,
      dish: undefined,
      currentCategory: undefined
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEditSave = this.handleEditSave.bind(this);
    this.handleAddSave = this.handleAddSave.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(displayCategoriesTabs());
  }

  componentWillUnmount() {
    this.props.dispatch(hideCategoriesTabs());
  }

  render() {
    const { restaurantId } = this.props;
    const { currentCategory } = this.props.menuReducer;
    const isCategoriesLoading = this.props.menuReducer.isLoading;
    const { dishes } = this.props.dishReducer;
    let { isLoading } = this.props.dishReducer;
    const menuItemDetails = MENU_ITEM_DETAILS;
    if (
      currentCategory !== undefined &&
      currentCategory !== this.state.currentCategory
    ) {
      this.setState({
        currentCategory
      });
      menuItemDetails.name = currentCategory.name;
      this.props.dispatch(fetchDishes(restaurantId, currentCategory.id));
    }

    const crudItems = this.getCrudItemsFromDishes(dishes);
    return (
      <div>
        {!isCategoriesLoading ? <div style={{ height: "40px" }} /> : ""}
        <CrudList
          items={crudItems}
          detail={menuItemDetails}
          isLoading={isLoading}
          handleEdit={this.handleEdit}
          handleAdd={this.handleAdd}
          handleDelete={this.handleDelete}
        />
        <DishAddDialog
          open={this.state.openAddDialog}
          handleAddSave={this.handleAddSave}
          handleCancel={this.handleCancel}
        />
        <DishEditDialog
          open={this.state.openEditDialog}
          handleEditSave={this.handleEditSave}
          handleCancel={this.handleCancel}
          dish={this.state.dish}
        />
        <TableAndUserSetter />
      </div>
    );
  }
  getCrudItemsFromDishes(dishes) {
    if (dishes) {
      const items = [];
      for (let i = 0; i < dishes.length; i++) {
        let item = {};
        item.name = dishes[i].name;
        item.icon = dishes[i].image;
        item.description = dishes[i].description;
        item.link = "#";
        item.id = dishes[i].id;
        item.object = dishes[i];
        items.push(item);
      }
      return items;
    }
  }
  handleAdd() {
    this.setState({
      openEditDialog: false,
      openAddDialog: true,
      dish: undefined
    });
  }

  handleEditSave(dish) {
    const { currentCategory } = this.props.menuReducer;
    this.props.dispatch(
      editDishes(this.props.restaurantId, currentCategory.id, dish)
    );
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      dish: undefined
    });
  }
  handleAddSave(dish) {
    const { currentCategory } = this.props.menuReducer;
    this.props.dispatch(
      addDishes(this.props.restaurantId, currentCategory.id, dish)
    );
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      dish: undefined
    });
  }

  handleCancel() {
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      dish: undefined
    });
  }

  handleDelete(dish) {
    const { currentCategory } = this.props.menuReducer;
    this.props.dispatch(
      deleteDishes(this.props.restaurantId, currentCategory.id, dish)
    );
  }

  handleEdit(dish) {
    this.setState({
      openEditDialog: true,
      openAddDialog: false,
      dish: dish
    });
  }
}

Menu.propTypes = {
  restaurantId: PropTypes.string,
  dispatch: PropTypes.func,
  dishReducer: PropTypes.object,
  menuReducer: PropTypes.object,
  orderReducer: PropTypes.object,
  heading: PropTypes.string
};

const mapStateToProps = state => {
  return {
    menuReducer: state.MenuReducer,
    dishReducer: state.DishesReducer,
    orderReducer: state.OrderReducer
  };
};

export default connect(mapStateToProps)(Menu);
