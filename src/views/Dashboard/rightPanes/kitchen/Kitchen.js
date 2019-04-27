import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CrudList from "../../../CrudList";
import { KITCHEN_DETAILS } from "../../../../actions/navigationActions";

export class Kitchen extends Component {
  render() {
    const {
      ordersToBePrepared,
      isOrdersToBePreparedLoading
    } = this.props.order;
    return (
      <div>
        <CrudList
          hideAddBtn
          items={ordersToBePrepared}
          detail={KITCHEN_DETAILS}
          isLoading={isOrdersToBePreparedLoading}
        />
      </div>
    );
  }
}

Kitchen.propTypes = {
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
  dispatch: PropTypes.func,
  order: PropTypes.object,
  open: PropTypes.bool,
  restaurant: PropTypes.object
};

const mapStateToProps = state => {
  return {
    order: state.OrderReducer,
    restaurant: state.RestaurantReducer
  };
};

export default connect(mapStateToProps)(Kitchen);
