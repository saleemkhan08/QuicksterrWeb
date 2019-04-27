import React, { Component } from "react";
import GridItem from "../../../../components/Grid/GridItem";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import "../orders/Order.css";
import { connect } from "react-redux";

class KitchenItemCard extends Component {
  render() {
    const { dish, count, tableSplit } = this.props.item;
    return (
      <GridItem xs={12} sm={6} md={4} lg={3}>
        <Paper className="menuCardContainer">
          <div>
            <h3>{dish.name}</h3>
            <h5>Total : {count}</h5>
            {tableSplit.map(table => {
              return (
                <h6 key={table.name + table.count}>
                  {table.name} : {table.count}
                </h6>
              );
            })}

            <Divider />
          </div>
        </Paper>
      </GridItem>
    );
  }
}

KitchenItemCard.propTypes = {
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

export default connect(mapStateToProps)(KitchenItemCard);
