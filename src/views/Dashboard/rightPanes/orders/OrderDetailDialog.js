import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import { connect } from "react-redux";
import { closeOrderDetailDialog, TAKE_AWAY } from "./ordersActions";
import { IconButton, Divider } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
class OrderDetailDialog extends React.Component {
  handleClose = () => {
    this.props.dispatch(closeOrderDetailDialog());
  };

  render() {
    const { openOrderDetailDialog, selectedOrder } = this.props.order;
    if (selectedOrder) {
      const {
        table,
        dishes,
        totalPackingCharges,
        totalServiceCharges,
        totalTax,
        totalAmountToPay,
        name
      } = selectedOrder;
      const isTakeAway = table === TAKE_AWAY;
      const tableName = isTakeAway
        ? TAKE_AWAY + " - Order Details"
        : table
        ? table.name + " - Order Details"
        : "Order Details";
      return (
        <Dialog onClose={this.handleClose} open={openOrderDetailDialog}>
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
            {name}
          </DialogTitle>
          <DialogContent className="dialog-content">
            <List>
              {dishes.map(dish => {
                return (
                  <div key={dish.id}>
                    {this.getOrdersListItems(dish)}
                    <Divider />
                  </div>
                );
              })}
            </List>
            {isTakeAway ? (
              <div className="extra-charges-container">
                <p className="extra-charges-text">PACKING CHARGES</p>
                <p className="extra-charges-text">
                  {"₹" + totalPackingCharges}
                </p>
              </div>
            ) : (
              <div className="extra-charges-container">
                <p className="extra-charges-text">SERVICE TAX (5%)</p>
                <p className="extra-charges-text">
                  {"₹" + totalServiceCharges}
                </p>
              </div>
            )}
            <div className="extra-charges-container">
              <p className="extra-charges-text">SGST (2.5%)</p>
              <p className="extra-charges-text">{"₹" + totalTax / 2}</p>
            </div>
            <div className="extra-charges-container">
              <p className="extra-charges-text">CGST (2.5%)</p>
              <p className="extra-charges-text">{"₹" + totalTax / 2}</p>
            </div>
            <Divider />
            <div className="total-container">
              <p className="total-text">TOTAL</p>
              <p className="total-text">{"₹" + totalAmountToPay}</p>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
    return "";
  }
  getOrdersListItems = order => {
    if (order) {
      const price = "₹" + order.price * order.count;
      return (
        <ListItem className="order-list-item">
          <ListItemText primary={order.name} className="order-text" />
          <div className="orderCountContainer">
            <h5 className="orderCount"> {order.count} </h5>
          </div>
          <h5 className="price-text">{price}</h5>
        </ListItem>
      );
    }
  };
}

OrderDetailDialog.propTypes = {
  dispatch: PropTypes.func,
  order: PropTypes.object
};

const mapStateToProps = state => {
  return {
    order: state.OrderReducer
  };
};

export default connect(mapStateToProps)(OrderDetailDialog);
