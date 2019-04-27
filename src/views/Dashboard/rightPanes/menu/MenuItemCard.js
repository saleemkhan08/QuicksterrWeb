import React, { Component } from "react";
import { MENU_ITEM_DETAILS } from "../../../../actions/navigationActions";
import { openImageUploadDialog } from "../../../../actions/imagesActions";
import CameraAlt from "@material-ui/icons/CameraAlt";
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
import Fab from "@material-ui/core/Fab";
import { connect } from "react-redux";
import { RESTAURANTS } from "../../../../views/RestaurantPage/restaurantActions";
import { CATEGORIES } from "../../../../actions/menuActions";
import {
  addItemToOrder,
  removeItemFromOrder,
  setCurrentOrderRestaurant,
  openVariantOrderDialog,
  CLEAR_CURRENT_ORDERS
} from "../orders/ordersActions";
import { showMessage } from "../../../../actions/messageActions";
import veg from "../../../../assets/img/veg.svg";
import nonVeg from "../../../../assets/img/nonVeg.svg";
import { DISHES } from "../../../../actions/dishesActions";
export class MenuItemCard extends Component {
  render() {
    const { item } = this.props;
    const { currentCategory } = this.props.menu;
    if (currentCategory) {
      let icon = item && item.icon ? item.icon : currentCategory.icon;
      icon = icon ? icon : MENU_ITEM_DETAILS.icon;
      const itemName = item ? item.name : "" + currentCategory.name;
      const itemId = item ? item.id : "";
      const itemDescription = item ? item.description : "";
      const currentCategoryId = currentCategory ? currentCategory.id : "";
      const isDisabled = item.object.active !== "Y";
      let menuItemClass = "menuCardContainer";
      if (isDisabled) menuItemClass = "menuCardContainer-disabled";
      const variants = item.object.variant.split(",");
      const isCustomizable = variants.length > 1;
      return (
        <GridItem xs={12} sm={6} md={4} lg={3}>
          <Paper className={menuItemClass}>
            {this.getAdminOptions(item)}
            <img
              alt=""
              className="veg-symbol"
              src={item.object.veg === "Y" ? veg : nonVeg}
            />
            <div className="menu-img-container">
              {this.showImgUploadBtn(itemName, itemId, currentCategoryId)}
              {icon.includes(".svg") ? (
                <img alt="" className="menuItemImgContain" src={icon} />
              ) : (
                <img alt="" className="menuItemImg" src={icon} />
              )}
            </div>
            <h5 className="cardHeading">{itemName}</h5>
            <p className="cardDescription">{itemDescription}</p>
            <Divider className="divider" />
            {isDisabled
              ? this.showUnavailable()
              : this.getOrderLayout(item, isCustomizable)}
          </Paper>
        </GridItem>
      );
    }
    return "";
  }

  showUnavailable = () => {
    return <h3 className="unavailable"> Unavailable</h3>;
  };

  getOrderLayout(item, isCustomizable) {
    const price = item.object.price.split(",")[0];
    return (
      <div className="textContainer">
        <h3 className="price"> &#8377; {price}</h3>
        {isCustomizable
          ? this.showExtendedTrayFab(item)
          : this.showTrayFab(item)}
      </div>
    );
  }
  showExtendedTrayFab = item => {
    return (
      <Fab
        onClick={() => this.customizeItemToOrder(item)}
        variant="extended"
        aria-label="customize"
        className="customize-order"
      >
        <span className="customize-order-txt">Customize</span>
        <img alt="" src={order} className="orderImage" />
      </Fab>
    );
  };

  customizeItemToOrder = item => {
    this.props.dispatch(openVariantOrderDialog(item));
  };

  showTrayFab = item => {
    const existingOrderItem = this.props.order.currentOrderList[item.id];
    const currentOrderItem = existingOrderItem ? existingOrderItem : item;
    currentOrderItem.count = existingOrderItem ? existingOrderItem.count : 0;
    const displayCount = currentOrderItem.count > 0 ? "flex" : "none";
    const displayCountInverse = currentOrderItem.count > 0 ? "none" : "flex";
    return (
      <div className="textContainer">
        <Button
          variant="fab"
          aria-label="Add"
          color="default"
          size="small"
          className="orderButton"
          onClick={() => this.addItemToOrder(currentOrderItem)}
          style={{ display: `${displayCountInverse}` }}
        >
          <img alt="" src={order} className="orderImage" />
        </Button>
        <div style={{ display: `${displayCount}` }}>
          <div className="orderCountContainer">
            <IconButton
              className="orderCountIcon"
              onClick={() => this.addItemToOrder(currentOrderItem)}
            >
              <AddIcon />
            </IconButton>
            <h5 className="orderCount"> {currentOrderItem.count} </h5>
            <IconButton
              className="orderCountIcon"
              onClick={() => this.removeItemFromOrder(currentOrderItem)}
            >
              <RemoveIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  };
  showImgUploadBtn = (keywords, id, catId) => {
    if (this.props.showAdminOptions) {
      const { restaurantId } = this.props.restaurant.currentRestaurant;
      const refPath =
        RESTAURANTS +
        "/" +
        restaurantId +
        "/" +
        CATEGORIES +
        "/" +
        catId +
        "/" +
        DISHES +
        "/" +
        id;
      return (
        <IconButton
          className="menu-img-upload-btn"
          onClick={() => {
            this.props.dispatch(openImageUploadDialog(keywords, refPath));
          }}
        >
          <CameraAlt />
        </IconButton>
      );
    }
  };

  addItemToOrder = currentOrderList => {
    const { currentOrderRestaurant } = this.props.order;
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
  restaurant: PropTypes.object,
  menu: PropTypes.object
};

const mapStateToProps = state => {
  return {
    order: state.OrderReducer,
    restaurant: state.RestaurantReducer,
    menu: state.MenuReducer
  };
};

export default connect(mapStateToProps)(MenuItemCard);
