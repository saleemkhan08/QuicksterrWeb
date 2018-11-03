import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  addItemToOrder,
  removeItemFromOrder,
  clearCurrentOrders
} from "../../../../actions/ordersActions";
import AddIcon from "@material-ui/icons/AddCircleOutlineRounded";
import RemoveIcon from "@material-ui/icons/RemoveCircleOutlineRounded";
import PropTypes from "prop-types";
import "./Order.css";
import CloseIcon from "@material-ui/icons/Close";
import {
  placeOrder,
  PLACING_ORDER,
  ORDER_PLACED,
  FAILED_TO_PLACE_ORDER,
  PREPAIRING_ORDER,
  UPDATING_ORDER,
  FAILED_TO_UPDATE_ORDER,
  ORDER_UPDATED,
  PREPAIRING_UPDATED_ORDER,
  ORDER_PREPAIRED,
  ORDER_SERVED,
  PAYMENT_RECEIVED
} from "../../../../actions/ordersActions";
import IconButton from "@material-ui/core/IconButton";
import { showMessage } from "../../../../actions/messageActions";
class CurrentOrdersDialog extends React.Component {
  getCompleteOrder = currentOrderList => {
    let totalOrderPrice = 0;
    let totalPackingCharges = 0;
    let totalTax = 0;
    let totalServiceCharges = 0;
    const completeOrder = {};
    let keys = Object.keys(currentOrderList);
    const dishes = [];
    if (keys) {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const order = currentOrderList[key];
        if (order) {
          totalOrderPrice += order.object.price * order.count;
          totalPackingCharges += order.object.packingCharge * order.count;
          totalTax += order.object.tax * order.count;
          totalServiceCharges += order.object.serviceCharge * order.count;
          const tempOrder = order.object;
          tempOrder["count"] = order.count;
          dishes.push(tempOrder);
        }
      }
    }
    completeOrder["dishes"] = dishes;
    completeOrder["totalPackingCharges"] = totalPackingCharges;
    completeOrder["totalTax"] = totalTax;
    completeOrder["totalServiceCharges"] = totalServiceCharges;
    completeOrder["totalAmountToPay"] =
      totalOrderPrice + totalPackingCharges + totalTax + totalServiceCharges;
    return completeOrder;
  };

  render() {
    const {
      status,
      currentOrderList,
      currentOrderRestaurant,
      table,
      customer,
      noOfPeople
    } = this.props.order;
    let restaurantId = currentOrderRestaurant
      ? currentOrderRestaurant.restaurantId
      : undefined;
    const keys = Object.keys(currentOrderList);
    const completeOrder = this.getCompleteOrder(currentOrderList);
    const {
      totalPackingCharges,
      totalTax,
      totalServiceCharges,
      totalAmountToPay
    } = completeOrder;
    completeOrder["table"] = table;
    completeOrder["customer"] = customer;
    completeOrder["status"] = status;
    completeOrder["noOfPeople"] = noOfPeople;
    this.showStatusMessages(status);
    const isStatusChanging =
      status === PLACING_ORDER || status === UPDATING_ORDER;
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
      >
        <IconButton
          key="close"
          aria-label="Close"
          color="default"
          className="close-dialog-btn"
          onClick={this.props.handleClose}
          disabled={isStatusChanging}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle id="scroll-dialog-title">
          {this.getTitle(status)}
        </DialogTitle>
        <DialogContent>
          {isStatusChanging ? <LinearProgress /> : ""}

          <List>
            {keys.map(key => {
              return (
                <div key={key}>
                  {this.getOrdersListItems(currentOrderList[key])}
                  <Divider />
                </div>
              );
            })}
          </List>
          <div className="extra-charges-container">
            <p className="extra-charges-text">PACKING CHARGES</p>
            <p className="extra-charges-text">{"₹" + totalPackingCharges}</p>
          </div>
          <div className="extra-charges-container">
            <p className="extra-charges-text">SERVICE TAX (5%)</p>
            <p className="extra-charges-text">{"₹" + totalServiceCharges}</p>
          </div>
          <div className="extra-charges-container">
            <p className="extra-charges-text">SGST (2.5%)</p>
            <p className="extra-charges-text">{"₹" + totalTax / 2}</p>
          </div>
          <div className="extra-charges-container">
            <p className="extra-charges-text">CGST (2.5%)</p>
            <p className="extra-charges-text">{"₹" + totalTax / 2}</p>
          </div>
        </DialogContent>
        <div className="dialog-action-container">
          <div className="total-container">
            <p className="total-text">TOTAL</p>
            <p className="total-text">{"₹" + totalAmountToPay}</p>
          </div>
          <Divider />
          <div className="dialog-action-btn-container">
            <Button
              onClick={() => this.props.dispatch(clearCurrentOrders())}
              color="secondary"
              disabled={isStatusChanging}
            >
              Clear All
            </Button>
            <Button
              onClick={() => this.handlePlaceOrder(restaurantId, completeOrder)}
              color="primary"
              disabled={isStatusChanging}
            >
              Place Order
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  showStatusMessages = status => {
    switch (status) {
      case FAILED_TO_PLACE_ORDER:
        this.props.dispatch(
          showMessage("Failed to place the order! Please try again")
        );
        return;
      case FAILED_TO_UPDATE_ORDER:
        this.props.dispatch(
          showMessage("Failed to updated the order! Please try again")
        );
        return;
      default:
        return;
    }
  };
  getTitle = status => {
    switch (status) {
      case PLACING_ORDER:
        return "Placing Order...";
      case ORDER_PLACED:
        return "Order Placed";
      case PREPAIRING_ORDER:
        return "Prepairing Order...";
      case UPDATING_ORDER:
        return "Updating Order...";
      case ORDER_UPDATED:
        return "Order Placed";
      case PREPAIRING_UPDATED_ORDER:
        return "Prepairing Order...";
      case ORDER_PREPAIRED:
        return "Order Prepaired";
      case ORDER_SERVED:
        return "Order Served";
      case PAYMENT_RECEIVED:
        return "Payment Received";
      default:
        return "Order";
    }
  };
  getOrdersListItems = order => {
    if (order) {
      const price = "₹" + order.object.price * order.count;
      return (
        <ListItem button className="order-list-item">
          <ListItemText primary={order.name} className="order-text" />
          <div className="orderCountContainer">
            <IconButton
              className="orderCountIcon"
              onClick={() => this.props.dispatch(addItemToOrder(order))}
            >
              <AddIcon />
            </IconButton>
            <h5 className="orderCount"> {order.count} </h5>
            <IconButton
              className="orderCountIcon"
              onClick={() => this.props.dispatch(removeItemFromOrder(order))}
            >
              <RemoveIcon />
            </IconButton>
          </div>
          <h5 className="price-text">{price}</h5>
        </ListItem>
      );
    }
  };
  handlePlaceOrder = (resId, completeOrder) => {
    this.props.dispatch(placeOrder(resId, completeOrder));
  };
}

CurrentOrdersDialog.propTypes = {
  open: PropTypes.bool,
  dispatch: PropTypes.func,
  order: PropTypes.object,
  handleClose: PropTypes.func
};

const mapStateToProps = state => {
  return {
    order: state.OrderReducer
  };
};

export default connect(mapStateToProps)(CurrentOrdersDialog);
