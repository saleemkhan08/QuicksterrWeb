import React, { Component } from "react";
import PropTypes from "prop-types";
import { fetchCategories } from "../../../../actions/menuActions";
import { connect } from "react-redux";
import CRUDList from "../../../CrudList";
import { NOTIFICATION_DETAILS } from "../../../../actions/authActions";

class Orders extends Component {
  componentDidMount() {
    const { restaurantId } = this.props;
    this.props.dispatch(fetchCategories(restaurantId));
  }
  render() {
    const { categories, isLoading } = this.props.reducer;
    return (
      <CRUDList
        items={categories}
        detail={NOTIFICATION_DETAILS}
        isLoading={isLoading}
      />
    );
  }
}
Orders.propTypes = {
  restaurantId: PropTypes.string,
  dispatch: PropTypes.func,
  reducer: PropTypes.object,
  heading: PropTypes.string
};
const mapStateToProps = state => {
  return {
    reducer: state.MenuReducer
  };
};

export default connect(mapStateToProps)(Orders);
