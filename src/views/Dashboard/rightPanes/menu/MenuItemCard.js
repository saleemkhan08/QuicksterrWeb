import React, { Component } from "react";
import { MENU_ITEM_DETAILS } from "../../../../actions/authActions";
import GridItem from "../../../../components/Grid/GridItem";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/AddCircleOutlineRounded";
import RemoveIcon from "@material-ui/icons/RemoveCircleOutlineRounded";
import Button from "@material-ui/core/Button";
import order from "../../../../assets/img/sidebar-icons/orders.svg";
import "./MenuStyle.css";
import { connect } from "react-redux";
import {
  addItemToOrder,
  openTableAndUserSetter,
  removeItemFromOrder,
  setCurrentOrderRestaurant,
  CLEAR_CURRENT_ORDERS
} from "../../../../actions/ordersActions";
import { showMessage } from "../../../../actions/messageActions";

export class MenuItemCard extends Component {
  render() {
    const { item } = this.props;
    const icon = item.icon ? item.icon : MENU_ITEM_DETAILS.icon;
    return (
      <GridItem xs={12} sm={6} md={4} lg={3}>
        <Paper className="menuCardContainer">
          {this.getAdminOptions(item)}
          <img alt="" className="menuItemImg" src={icon} />
          <h5 className="cardHeading">{item.name}</h5>
          <p className="cardDescription">{item.description}</p>
          <Divider className="divider" />
          {this.getOrderLayout(item)}
        </Paper>
      </GridItem>
    );
  }

  getOrderLayout(item) {
    const currentOrderListRef = this.props.order.currentOrderList[item.id];
    const currentOrderList = currentOrderListRef ? currentOrderListRef : item;
    currentOrderList.count = currentOrderListRef ? currentOrderList.count : 0;

    const displayCount = currentOrderList.count > 0 ? "flex" : "none";
    const displayCountInverse = currentOrderList.count > 0 ? "none" : "flex";

    return (
      <div className="textContainer">
        <h3 className="price"> &#8377; {item.object.price}</h3>
        <Button
          variant="fab"
          aria-label="Add"
          color="default"
          size="small"
          className="orderButton"
          onClick={() => this.addItemToOrder(currentOrderList)}
          style={{ display: `${displayCountInverse}` }}
        >
          <img alt="" src={order} className="orderImage" />
        </Button>
        <div style={{ display: `${displayCount}` }}>
          <div className="orderCountContainer">
            <IconButton
              className="orderCountIcon"
              onClick={() => this.addItemToOrder(currentOrderList)}
            >
              <AddIcon />
            </IconButton>
            <h5 className="orderCount"> {currentOrderList.count} </h5>
            <IconButton
              className="orderCountIcon"
              onClick={() => this.removeItemFromOrder(currentOrderList)}
            >
              <RemoveIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }

  addItemToOrder = currentOrderList => {
    const { currentOrderRestaurant, table } = this.props.order;
    let orderResId = currentOrderRestaurant
      ? currentOrderRestaurant.restaurantId
      : undefined;
    const currentRestaurant = this.props.restaurant.currentRestaurant;
    const currentResId = currentRestaurant.restaurantId;
    if (orderResId === undefined) {
      this.props.dispatch(setCurrentOrderRestaurant(currentRestaurant));
      orderResId = currentResId;
    }
    if (orderResId === currentResId) {
      this.props.dispatch(addItemToOrder(currentOrderList));
      if (table === undefined) {
        this.props.dispatch(openTableAndUserSetter());
      }
    } else {
      this.props.dispatch(
        showMessage(
          "You cannot order from 2 different restaurants",
          CLEAR_CURRENT_ORDERS,
          "CLEAR CURRENT ORDER"
        )
      );
    }
  };

  removeItemFromOrder = currentOrderList => {
    this.props.dispatch(removeItemFromOrder(currentOrderList));
  };

  getAdminOptions(item) {
    if (this.props.showAdminOptions) {
      return (
        <div>
          <IconButton className="closeBtn" size="small">
            <ClearIcon onClick={() => this.props.handleDeleteClick(item)} />
          </IconButton>
          <IconButton className="editBtn" size="small">
            <EditIcon onClick={() => this.props.handleEdit(item.object)} />
          </IconButton>
        </div>
      );
    }
  }
}

MenuItemCard.propTypes = {
  item: PropTypes.object,
  classes: PropTypes.object,
  handleDeleteClick: PropTypes.func,
  handleEdit: PropTypes.func,
  showAdminOptions: PropTypes.bool,
  dispatch: PropTypes.func,
  order: PropTypes.object,
  restaurant: PropTypes.object
};

const mapStateToProps = state => {
  return {
    order: state.OrderReducer,
    restaurant: state.RestaurantReducer
  };
};

export default connect(mapStateToProps)(MenuItemCard);
