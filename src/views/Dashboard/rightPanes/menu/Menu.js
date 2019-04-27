import React, { Component } from "react";
import {
  fetchDishes,
  addDishes,
  editDishes,
  deleteDishes
} from "../../../../actions/dishesActions";
import { MENU_ITEM_DETAILS } from "../../../../actions/navigationActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CrudList from "../../../CrudList";
import DishAddDialog from "./DishAddDialog";
import DishEditDialog from "./DishEditDialog";

import {
  displayCategoriesTabs,
  hideCategoriesTabs,
  setCurrentCategory
} from "../../../../actions/menuActions";
import MenuImport from "./MenuImport";
import VariantOrderDialog from "./VariantOrderDialog";

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

  componentDidUpdate() {
    const { restaurantId } = this.props;
    const { currentCategory } = this.props.menuReducer;
    if (
      currentCategory !== undefined &&
      currentCategory !== this.state.currentCategory
    ) {
      this.setState({
        currentCategory
      });
      MENU_ITEM_DETAILS.name = currentCategory.name;
      this.props.dispatch(fetchDishes(restaurantId, currentCategory.id));
    }
  }

  render() {
    const { isAdmin } = this.props.navigationReducer;
    const isCategoriesLoading = this.props.menuReducer.isLoading;
    const { categories, displayCategories } = this.props.menuReducer;
    const { isLoading, dishes } = this.props.dishReducer;
    const crudItems = this.getCrudItemsFromDishes(dishes);
    return (
      <div>
        {displayCategories && !isCategoriesLoading && categories.length > 0 ? (
          <div className="categoriesPadding" style={{ height: "40px" }} />
        ) : (
          ""
        )}
        <CrudList
          items={crudItems}
          detail={MENU_ITEM_DETAILS}
          isLoading={isLoading}
          handleEdit={this.handleEdit}
          handleAdd={this.handleAdd}
          handleDelete={this.handleDelete}
        >
          {isAdmin ? <MenuImport onMenuImported={this.onMenuImported} /> : ""}
        </CrudList>
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
        <VariantOrderDialog />
      </div>
    );
  }

  onMenuImported = () => {
    const { categories } = this.props.menuReducer;
    this.props.dispatch(setCurrentCategory(categories[0]));
  };

  getCrudItemsFromDishes(dishes) {
    if (dishes) {
      const items = [];
      for (let i = 0; i < dishes.length; i++) {
        let item = {};
        item.name = dishes[i].name;
        item.icon = dishes[i].icon;
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
  heading: PropTypes.string,
  navigationReducer: PropTypes.object
};

const mapStateToProps = state => {
  return {
    menuReducer: state.MenuReducer,
    dishReducer: state.DishesReducer,
    orderReducer: state.OrderReducer,
    navigationReducer: state.NavigationReducer
  };
};

export default connect(mapStateToProps)(Menu);
