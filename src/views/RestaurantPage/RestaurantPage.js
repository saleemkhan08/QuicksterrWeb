import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import { hideCategoriesTabs } from "../../actions/menuActions";
import PropTypes from "prop-types";
import "./RestaurantPage.css";
import {
  fetchRestaurants,
  addRestaurants,
  editRestaurants,
  fetchCurrentRestaurant,
  fetchCategoriesToDeleteRestaurant
} from "./restaurantActions";
import {
  changeNavbarColor,
  RESTAURANT_DETAILS
} from "../../actions/navigationActions";
import CRUDList from "../CrudList";
import RestaurantEditDialog from "./RestaurantEditDialog";
import RestaurantAddDialog from "./RestaurantAddDialog";
import { setAdminStatus, MASTER_ADMIN } from "../../actions/navigationActions";
class RestaurantPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openEditDialog: false,
      openAddDialog: false,
      restaurant: undefined
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEditSave = this.handleEditSave.bind(this);
    this.handleAddSave = this.handleAddSave.bind(this);
  }

  componentDidMount() {
    const { restaurants } = this.props.reducer.restaurants;
    if (restaurants === undefined) {
      this.props.dispatch(fetchRestaurants());
    }
    this.props.dispatch(hideCategoriesTabs());
    if (this.props.navigation.navbarColor !== "white") {
      this.props.dispatch(changeNavbarColor("white"));
    }
  }

  render() {
    const { isLoading } = this.props.reducer;
    const { restaurants } = this.props.reducer;
    //set admin status
    const { user, isAdmin } = this.props.navigation;
    if (user) {
      const isAdminTemp = user.type === MASTER_ADMIN;
      if (isAdminTemp !== isAdmin) {
        this.props.dispatch(setAdminStatus(isAdminTemp));
      }
    }
    const crudItems = this.getCrudItemsFromRestaurants(restaurants);
    return (
      <div>
        <div className="full-height-container container">
          <CRUDList
            items={crudItems}
            detail={RESTAURANT_DETAILS}
            isLoading={isLoading}
            handleEdit={this.handleEdit}
            handleAdd={this.handleAdd}
            handleDelete={this.handleDelete}
            onLinkClick={this.handleLinkClick}
            horizontal
            showImgUploadBtn
          />
          <RestaurantAddDialog
            open={this.state.openAddDialog}
            handleAddSave={this.handleAddSave}
            handleCancel={this.handleCancel}
          />
          <RestaurantEditDialog
            open={this.state.openEditDialog}
            handleEditSave={this.handleEditSave}
            handleCancel={this.handleCancel}
            restaurant={this.state.restaurant}
          />
        </div>
      </div>
    );
  }
  handleLinkClick = restaurant => {
    this.props.dispatch(fetchCurrentRestaurant(restaurant.id));
  };

  handleAdd() {
    this.setState({
      openEditDialog: false,
      openAddDialog: true,
      restaurant: undefined
    });
  }

  handleEditSave(restaurant) {
    this.props.dispatch(editRestaurants(restaurant));
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      restaurant: undefined
    });
  }
  handleAddSave(restaurant) {
    this.props.dispatch(addRestaurants(restaurant));
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      restaurant: undefined
    });
  }

  handleCancel() {
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      restaurant: undefined
    });
  }

  handleDelete(restaurant) {
    this.props.dispatch(fetchCategoriesToDeleteRestaurant(restaurant));
  }

  handleEdit(restaurant) {
    this.setState({
      openEditDialog: true,
      openAddDialog: false,
      restaurant: restaurant
    });
  }

  getCrudItemsFromRestaurants(restaurants) {
    if (restaurants) {
      const items = [];
      for (let i = 0; i < restaurants.length; i++) {
        let item = {};
        item.name = restaurants[i].name;
        item.icon = restaurants[i].icon;
        item.description = restaurants[i].address;
        item.link = "/dashboard/" + restaurants[i].restaurantId;
        item.id = restaurants[i].restaurantId;
        item.object = restaurants[i];
        items.push(item);
      }
      return items;
    }
  }
}

RestaurantPage.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
  reducer: PropTypes.object,
  menu: PropTypes.object
};

const mapStateToProps = state => {
  return {
    reducer: state.RestaurantReducer,
    navigation: state.NavigationReducer,
    menu: state.MenuReducer
  };
};

export default connect(mapStateToProps)(
  withStyles(landingPageStyle)(RestaurantPage)
);
