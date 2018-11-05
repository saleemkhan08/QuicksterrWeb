import React, { Component } from "react";
import GridItem from "../../../../components/Grid/GridItem";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import "./Order.css";
import { connect } from "react-redux";
import {
  ORDER_PLACED,
  PREPAIRING_ORDER,
  ORDER_PREPAIRED,
  ORDER_SERVED,
  DINING,
  PAYMENT_RECEIVED
} from "../../../../actions/ordersActions";

import orderPlaced from "../../../../assets/img/sidebar-icons/orderPlaced.svg";
import prepairing from "../../../../assets/img/sidebar-icons/prepairing.svg";
import prepaired from "../../../../assets/img/sidebar-icons/prepaired.svg";
import served from "../../../../assets/img/sidebar-icons/served.svg";
import happyDining from "../../../../assets/img/sidebar-icons/happyDining.svg";
import billPaid from "../../../../assets/img/sidebar-icons/billPaid.svg";
import error from "../../../../assets/img/sidebar-icons/error.svg";

class OrderItemCard extends Component {
  render() {
    const { table, noOfPeople, timeStamp, totalAmountToPay } = this.props.item;
    const { icon, text } = this.getStatus(this.props.item);
    return (
      <GridItem xs={12} sm={6} md={4} lg={3}>
        <Paper className="menuCardContainer">
          <img alt="" className="menuItemImg" src={icon} />
          <div className="title-container">
            <div>
              <h5 className="table-name">{table}</h5>
              <p className="status">{text}</p>
            </div>
            <div>
              <h5 className="people-count">
                {noOfPeople && noOfPeople > 1
                  ? noOfPeople + " People"
                  : "1 Person"}
              </h5>
              <p className="time-stamp">{timeStamp}</p>
            </div>
          </div>
          <Divider className="divider" />
          <div className="title-container">
            <h3 className="total-text"> Total </h3>
            <h3 className="total-price"> &#8377; {totalAmountToPay}</h3>
          </div>
        </Paper>
      </GridItem>
    );
  }

  getStatus = item => {
    let icon = "";
    let text = "";

    switch (item.status) {
      case ORDER_PLACED:
        icon = orderPlaced;
        text = "Order placed";
        break;
      case PREPAIRING_ORDER:
        icon = prepairing;
        text = "Food is being prepaired";
        break;
      case ORDER_PREPAIRED:
        icon = prepaired;
        text = "Ready to serve";
        break;
      case ORDER_SERVED:
        icon = served;
        text = "Food served";
        break;
      case DINING:
        icon = happyDining;
        text = "Happy dining";
        break;
      case PAYMENT_RECEIVED:
        icon = billPaid;
        text = "Bill paid";
        break;
      default:
        icon = error;
        text = "Status Unknown";
        break;
    }
    return { icon, text };
  };
}

OrderItemCard.propTypes = {
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

export default connect(mapStateToProps)(OrderItemCard);
