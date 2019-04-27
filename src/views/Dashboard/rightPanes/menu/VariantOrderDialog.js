import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@material-ui/icons/AddCircleOutlineRounded";
import RemoveIcon from "@material-ui/icons/RemoveCircleOutlineRounded";
import PropTypes from "prop-types";
import Slide from "@material-ui/core/Slide";
import "../orders/Order.css";
import CloseIcon from "@material-ui/icons/Close";
import {
  closeVariantOrderDialog,
  addItemToOrder,
  removeItemFromOrder,
  setCurrentOrderRestaurant,
  CLEAR_CURRENT_ORDERS
} from "../orders/ordersActions";
import IconButton from "@material-ui/core/IconButton";
import { showMessage } from "../../../../actions/messageActions";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class VariantOrderDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleClose = () => {
    this.props.dispatch(closeVariantOrderDialog());
  };
  render() {
    const { currentDish, openVariantOrderDialog } = this.props.order;
    const temp = currentDish ? { ...currentDish.object } : {};
    const variantNames = currentDish
      ? currentDish.object.variant.split(",")
      : [];
    const prices = temp.price ? temp.price.split(",") : [];
    const variants = this.getVariants(variantNames, prices);
    return (
      <Dialog
        open={openVariantOrderDialog}
        onClose={this.handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        TransitionComponent={Transition}
      >
        <IconButton
          key="close"
          aria-label="Close"
          color="default"
          className="close-dialog-btn"
          onClick={this.handleClose}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle id="scroll-dialog-title" className="dialog-title">
          {currentDish ? currentDish.name : "Variants"}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <List>
            {variants.map(variant => {
              return this.showVariantItem(variant, currentDish);
            })}
          </List>
        </DialogContent>
      </Dialog>
    );
  }
  showVariantItem = (variant, currentDish) => {
    const dish = { ...currentDish };
    const temp = currentDish ? currentDish.object : {};
    dish["object"] = { ...temp };
    dish["name"] = currentDish.name + " - " + variant.name;
    dish["id"] = currentDish.id + variant.name;
    dish.object["price"] = variant.price;
    return (
      <div key={variant.name}>
        {this.getVariantListItem(dish, variant)}
        <Divider />
      </div>
    );
  };

  getVariants = (names, prices) => {
    const variants = [];
    for (let i = 0; i < names.length; i++) {
      const variant = {};
      variant["price"] = prices[i].trim();
      variant["name"] = names[i].trim();
      variants.push(variant);
    }
    return variants;
  };

  getVariantListItem = (item, variant) => {
    const exisitingVariantItem = this.props.order.currentOrderList[item.id];
    const currentVariantItem = exisitingVariantItem
      ? exisitingVariantItem
      : item;
    currentVariantItem.count = exisitingVariantItem
      ? exisitingVariantItem.count
      : 0;

    const price = "₹" + item.object.price * currentVariantItem.count;
    return (
      <ListItem className="order-list-item">
        <ListItemText primary={variant.name} className="order-text" />
        <div className="orderCountContainer">
          <IconButton
            className="orderCountIcon"
            onClick={() => this.addItemToOrder(currentVariantItem)}
          >
            <AddIcon />
          </IconButton>
          <h5 className="orderCount"> {currentVariantItem.count} </h5>
          <IconButton
            className="orderCountIcon"
            onClick={() => this.removeItemFromOrder(currentVariantItem)}
          >
            <RemoveIcon />
          </IconButton>
        </div>
        <h5 className="price-text">{price}</h5>
      </ListItem>
    );
  };
  addItemToOrder = currentVariantItem => {
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
      this.props.dispatch(addItemToOrder(currentVariantItem));
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

  removeItemFromOrder = currentVariantItem => {
    this.props.dispatch(removeItemFromOrder(currentVariantItem));
  };
}

VariantOrderDialog.propTypes = {
  open: PropTypes.bool,
  dispatch: PropTypes.func,
  order: PropTypes.object,
  handleClose: PropTypes.func,
  restaurant: PropTypes.object
};

const mapStateToProps = state => {
  return {
    order: state.OrderReducer,
    restaurant: state.RestaurantReducer
  };
};

export default connect(mapStateToProps)(VariantOrderDialog);
