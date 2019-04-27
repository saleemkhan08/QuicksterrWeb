import React, { Component } from "react";
import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";
import firebase from "firebase/app";
import "firebase/auth";
import CircularProgress from "@material-ui/core/CircularProgress";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./Header.css";
import CurrentOrderDialog from "../../views/Dashboard/rightPanes/orders/CurrentOrderDialog";
import ActiveOrderListDialog from "../../views/Dashboard/rightPanes/orders/ActiveOrderListDialog";

import {
  setCurrentOrderRestaurant,
  openTableAndUserSetter,
  TAKE_AWAY
} from "../../views/Dashboard/rightPanes/orders/ordersActions";
import TableAndUserSetter from "../../views/Dashboard/rightPanes/menu/TableAndUserSetter";
import ProfileDialog from "./ProfileDialog";
import { openProfileDialog } from "../../actions/navigationActions";
const dashboardUserList = ["user", "masterAdmin"];
const activeOrdersUserList = [
  "restaurantAdmin",
  "masterAdmin",
  "waiter",
  "chef"
];
export class HeaderLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      orderListOpen: false
    };
  }

  render() {
    const { classes, navigation, order } = this.props;
    const showMainPageLinks = ["/"].includes(window.location.pathname);
    const { user } = navigation;
    return (
      <div>
        <List className={classes.list}>
          {this.getTableLink(classes, order, navigation)}
          {this.getOrdersLink(classes, order, navigation)}
          {this.getActiveOrdersLink(classes, order, navigation)}
          {this.getUserOptions(classes, navigation)}
          {user ? this.getLink(classes, "Restaurants", "/restaurants") : ""}
          {showMainPageLinks
            ? this.getHrefLink(classes, "About", "/#about")
            : ""}
          {showMainPageLinks
            ? this.getHrefLink(classes, "Pricing", "/#pricing")
            : ""}
          {showMainPageLinks
            ? this.getHrefLink(classes, "Contact", "/#contact")
            : ""}
          {navigation.isLoggedIn
            ? this.getProfile(classes, navigation)
            : this.getLoginLink(classes, navigation)}
        </List>
        <CurrentOrderDialog
          open={this.state.open}
          handleClose={() => this.handleOrderDialog(false)}
        />
        <ActiveOrderListDialog
          open={this.state.orderListOpen}
          handleClose={() => this.handleOrderListDialog(false)}
          onClose={() => this.handleOrderListDialog(false)}
        />
        <TableAndUserSetter />
        {user ? <ProfileDialog /> : ""}
      </div>
    );
  }

  getTableLink = (classes, order, navigation) => {
    const { table } = order;
    const { currentRestaurant } = this.props.restaurant;
    const isTakeAway = table === TAKE_AWAY;
    const tableName = isTakeAway
      ? TAKE_AWAY
      : table
      ? table.name
      : "Select Table";
    if (navigation.isLoggedIn && navigation.user && currentRestaurant) {
      return (
        <ListItem
          className={classes.listItem}
          onClick={() => {
            this.props.dispatch(openTableAndUserSetter());
          }}
        >
          <Link to="#" className={classes.navLink}>
            {tableName}
          </Link>
        </ListItem>
      );
    }
  };

  getOrdersLink = (classes, order, navigation) => {
    const { currentRestaurant } = this.props.restaurant;
    if (navigation.isLoggedIn && navigation.user && currentRestaurant) {
      const numOrders = Object.keys(order.currentOrderList).length;
      if (numOrders > 0) {
        return (
          <ListItem
            className={classes.listItem}
            onClick={() => this.handleOrderDialog(true)}
          >
            <Link to="#" className={classes.navLink}>
              Current Order
              <span className="badge-count">{numOrders}</span>
            </Link>
          </ListItem>
        );
      } else {
        if (this.props.order.currentOrderRestaurant) {
          this.props.dispatch(setCurrentOrderRestaurant(undefined));
        }
        if (this.state.open) {
          this.handleOrderDialog(false);
        }
      }
    }
  };

  getActiveOrdersLink = (classes, order, navigation) => {
    const { currentRestaurant } = this.props.restaurant;
    if (
      navigation.isLoggedIn &&
      navigation.user &&
      currentRestaurant &&
      activeOrdersUserList.includes(navigation.user.type)
    ) {
      const numOrders = Object.keys(order.activeOrders).length;
      if (numOrders > 0) {
        return (
          <ListItem
            className={classes.listItem}
            onClick={() => this.handleOrderListDialog(true)}
          >
            <Link to="#" className={classes.navLink}>
              Active Orders
              <span className="badge-count">{numOrders}</span>
            </Link>
          </ListItem>
        );
      } else {
        if (this.state.orderListOpen) {
          this.handleOrderListDialog(false);
        }
      }
    }
  };

  handleOrderListDialog = orderListOpen => {
    this.setState({
      orderListOpen
    });
  };

  handleOrderDialog = open => {
    this.setState({
      open
    });
  };

  getHrefLink = (classes, name, path) => {
    return (
      <ListItem className={classes.listItem}>
        <a href={path} className={classes.navLink}>
          {name}
        </a>
      </ListItem>
    );
  };

  getUserOptions = (classes, navigation) => {
    if (navigation.isLoggedIn && navigation.user) {
      return dashboardUserList.includes(navigation.user.type) ||
        !navigation.user.restaurantId
        ? ""
        : this.getLink(
            classes,
            "Dashboard",
            "/dashboard/" + navigation.user.restaurantId
          );
    }
  };

  getLink = (classes, name, path) => {
    return (
      <ListItem className={classes.listItem}>
        <Link to={path} className={classes.navLink}>
          {name}
        </Link>
      </ListItem>
    );
  };

  getLoginLink = (classes, navigation) => {
    return (
      <ListItem className={classes.listItem}>
        <Link
          to=""
          className={classes.navLink}
          onClick={() => this.loginWithGoogle(navigation)}
        >
          {navigation.isLoggingLoading ? (
            <CircularProgress size={20} />
          ) : (
            "LOGIN"
          )}
        </Link>
      </ListItem>
    );
  };

  loginWithGoogle = navigation => {
    if (!navigation.isLoggingLoading) {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  };

  getProfile = classes => {
    return (
      <ListItem className={classes.listItem}>
        <Link
          to="#"
          className={classes.navLink}
          onClick={() => this.props.dispatch(openProfileDialog())}
        >
          Profile
        </Link>
      </ListItem>
    );
  };
}
const mapStateToProps = state => {
  return {
    navigation: state.NavigationReducer,
    order: state.OrderReducer,
    restaurant: state.RestaurantReducer
  };
};

HeaderLinks.propTypes = {
  classes: PropTypes.object,
  navigation: PropTypes.object,
  order: PropTypes.object,
  restaurant: PropTypes.object,
  dispatch: PropTypes.func
};

export default connect(mapStateToProps)(
  withStyles(headerLinksStyle)(HeaderLinks)
);
