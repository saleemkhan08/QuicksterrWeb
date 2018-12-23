import React, { Component } from "react";
import PropTypes from "prop-types";
import { ORDER_DETAILS } from "../../../../actions/navigationActions";
import { connect } from "react-redux";
import CRUDList from "../../../CrudList";
import { fetchOrders, get2DigitNumber } from "./ordersActions";
import "./Order.css";
import Datetime from "react-datetime";
import "./Order.css";
class Orders extends Component {
  componentDidMount() {
    const { restaurantId } = this.props;
    this.props.dispatch(fetchOrders(restaurantId));
  }
  render() {
    const { orders, isLoading } = this.props.reducer;
    return (
      <CRUDList
        hideAddBtn
        items={orders}
        detail={ORDER_DETAILS}
        isLoading={isLoading}
      >
        <div className="date-picker">
          <Datetime
            inputProps={{ placeholder: "Date" }}
            timeFormat={false}
            defaultValue={new Date()}
            closeOnSelect
            dateFormat="DD/MM/YYYY"
            onChange={moment => this.handleChange(moment)}
          />
        </div>
      </CRUDList>
    );
  }

  handleChange = moment => {
    const { restaurantId } = this.props;
    const month = get2DigitNumber(moment.get("month") + 1);
    const date = get2DigitNumber(moment.get("date"));
    const dateKey = moment.get("year") + "" + month + "" + date;
    this.props.dispatch(fetchOrders(restaurantId, dateKey));
  };
}

Orders.propTypes = {
  restaurantId: PropTypes.string,
  dispatch: PropTypes.func,
  reducer: PropTypes.object,
  heading: PropTypes.string
};
const mapStateToProps = state => {
  return {
    reducer: state.OrderReducer
  };
};

export default connect(mapStateToProps)(Orders);
