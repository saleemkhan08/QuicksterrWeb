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
  deleteRestaurants
} from "../../actions/restaurantActions";
import {
  changeNavbarColor,
  RESTAURANT_DETAILS
} from "../../actions/authActions";
import CRUDList from "../CrudList";
import { SearchBar } from "../../components/Centered/CenteredUtils";
import RestaurantEditDialog from "./RestaurantEditDialog";
import RestaurantAddDialog from "./RestaurantAddDialog";
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
    if (this.props.auth.navbarColor !== "white") {
      this.props.dispatch(changeNavbarColor("white"));
    }
  }

  render() {
    const { isLoading } = this.props.reducer;
    const { restaurants } = this.props.reducer.restaurants;
    const crudItems = this.getCrudItemsFromRestaurants(restaurants);
    return (
      <div>
        <div className="full-height-container container">
          <SearchBar />
          <CRUDList
            items={crudItems}
            detail={RESTAURANT_DETAILS}
            isLoading={isLoading}
            handleEdit={this.handleEdit}
            handleAdd={this.handleAdd}
            handleDelete={this.handleDelete}
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
    this.props.dispatch(deleteRestaurants(restaurant));
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
  auth: PropTypes.object,
  dispatch: PropTypes.func,
  reducer: PropTypes.object
};

const mapStateToProps = state => {
  return {
    reducer: state.RestaurantReducer,
    auth: state.AuthReducer
  };
};

export default connect(mapStateToProps)(
  withStyles(landingPageStyle)(RestaurantPage)
);
