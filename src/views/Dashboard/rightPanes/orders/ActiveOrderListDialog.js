import React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { connect } from "react-redux";
import { TAKE_AWAY } from "./ordersActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Prev from "@material-ui/icons/ChevronLeftRounded";
import Next from "@material-ui/icons/ChevronRightRounded";
import Button from "@material-ui/core/Button";
import {
  getStatus,
  prevStatus,
  nextStatus,
  cancelStatus
} from "./ordersActions";
class CurrentOrdersListDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: [],
      expanded: ""
    };
  }
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  render() {
    const { activeOrders } = this.props.order;
    const { currentRestaurant } = this.props.restaurant;
    const restaurantId = currentRestaurant
      ? currentRestaurant.restaurantId
      : "";
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleClose}
        className="active-order-dialog"
      >
        <DialogTitle className="active-orders-dialog-title">
          Acitve Orders
        </DialogTitle>
        <div>
          <List>
            {activeOrders.map(order => {
              const name =
                order.table === TAKE_AWAY ? TAKE_AWAY : order.table.name;
              return this.getOrderListItems(restaurantId, order, name);
            })}
          </List>
        </div>
      </Dialog>
    );
  }
  getOrderListItems = (restaurantId, order, name) => {
    return (
      <ListItem key={order.id} className="list-item-expanded-outer-container">
        <div className="list-item-expanded-container">
          <div className="list-item-container">
            <div className="list-item-text">
              <span className="list-item-name">{name}</span>
              <span className="list-item-status">{getStatus(order).text}</span>
            </div>

            <IconButton
              size="small"
              aria-label="Prev"
              onClick={() =>
                this.props.dispatch(prevStatus(restaurantId, order))
              }
            >
              <Prev />
            </IconButton>
            <span className="status-btn-text">Status</span>
            <IconButton
              size="small"
              aria-label="Next"
              onClick={() =>
                this.props.dispatch(nextStatus(restaurantId, order))
              }
            >
              <Next />
            </IconButton>
            {this.showExpandColapseButton(order)}
          </div>
          {this.showDishesAndCancelButton(restaurantId, order)}
        </div>
      </ListItem>
    );
  };

  showDishesAndCancelButton = (restaurantId, order) => {
    return (
      <Collapse in={this.state.expand[order.id]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {this.getDishesListItems(order)}
        </List>
        <Button
          variant="outlined"
          color="secondary"
          className="cancelBtn"
          onClick={() => this.props.dispatch(cancelStatus(restaurantId, order))}
        >
          Cancel Order
        </Button>
      </Collapse>
    );
  };

  showExpandColapseButton = order => {
    return this.state.expand[order.id] ? (
      <IconButton
        size="small"
        aria-label="ExpandLess"
        onClick={() => {
          this.collapse(order);
        }}
      >
        <ExpandLess />
      </IconButton>
    ) : (
      <IconButton
        size="small"
        aria-label="ExpandMore"
        onClick={() => {
          this.expand(order);
        }}
      >
        <ExpandMore />
      </IconButton>
    );
  };

  expand = order => {
    const expand = this.state.expand;
    const expanded = this.state.expanded;
    expand[order.id] = true;
    expand[expanded] = false;
    this.setState({
      expand,
      expanded: order.id
    });
  };

  collapse = order => {
    const expand = this.state.expand;
    expand[order.id] = false;
    this.setState({
      expand
    });
  };

  getDishesListItems = order => {
    return order.dishes.map(dish => {
      return (
        <ListItem button className="nested" key={dish.id}>
          {dish.name}
        </ListItem>
      );
    });
  };
}

CurrentOrdersListDialog.propTypes = {
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

export default connect(mapStateToProps)(CurrentOrdersListDialog);
