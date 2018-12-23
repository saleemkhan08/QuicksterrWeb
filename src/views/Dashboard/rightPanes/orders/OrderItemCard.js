import React, { Component } from "react";
import GridItem from "../../../../components/Grid/GridItem";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import "./Order.css";
import { connect } from "react-redux";
import { getStatus } from "./ordersActions";

class OrderItemCard extends Component {
  render() {
    const { table, noOfPeople, timeStamp, totalAmountToPay } = this.props.item;
    const { icon, text } = getStatus(this.props.item);
    return (
      <GridItem xs={12} sm={6} md={4} lg={3}>
        <Paper className="menuCardContainer">
          {icon.includes(".svg") ? (
            <img alt="" className="menuItemImgContain" src={icon} />
          ) : (
            <img alt="" className="menuItemImg" src={icon} />
          )}
          <div className="title-container">
            <div>
              <h5 className="table-name">{table.name}</h5>
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
