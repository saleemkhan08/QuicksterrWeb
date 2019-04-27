import React, { Component } from "react";
import PropTypes from "prop-types";
import { ORDER_DETAILS } from "../../../../actions/navigationActions";
import { connect } from "react-redux";
import CRUDList from "../../../CrudList";
import { fetchOrders, get2DigitNumber } from "./ordersActions";
import "./Order.css";
import Datetime from "react-datetime";
import "./Order.css";
import OrderDetailDialog from "./OrderDetailDialog";
class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date()
    };
  }
  componentDidMount() {
    const { restaurantId } = this.props;
    const { isAdmin, user } = this.props.navigation;
    this.props.dispatch(fetchOrders(restaurantId, isAdmin, user.email));
  }
  render() {
    const { orders, isLoading } = this.props.reducer;
    return (
      <div>
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
              value={this.state.selectedDate}
              dateFormat="DD/MM/YYYY"
              onChange={moment => this.handleChange(moment)}
            />
          </div>
        </CRUDList>
        <OrderDetailDialog />
      </div>
    );
  }

  handleChange = moment => {
    this.setState({
      selectedDate: new Date(moment)
    });
    const { restaurantId } = this.props;
    const month = get2DigitNumber(moment.get("month") + 1);
    const date = get2DigitNumber(moment.get("date"));
    const dateKey = moment.get("year") + "" + month + "" + date;
    const { isAdmin, user } = this.props.navigation;
    this.props.dispatch(
      fetchOrders(restaurantId, isAdmin, user.email, dateKey)
    );
  };
}

Orders.propTypes = {
  restaurantId: PropTypes.string,
  dispatch: PropTypes.func,
  reducer: PropTypes.object,
  heading: PropTypes.string,
  navigation: PropTypes.object
};
const mapStateToProps = state => {
  return {
    reducer: state.OrderReducer,
    navigation: state.NavigationReducer
  };
};

export default connect(mapStateToProps)(Orders);
