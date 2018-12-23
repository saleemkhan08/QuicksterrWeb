import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import DrawerContent from "./DrawerContent";

import "./Dashboard.css";
import { styles } from "./DashboardStyle";
import Orders from "./rightPanes/orders/Orders";
import Tables from "./rightPanes/tables/Tables";
import Menu from "./rightPanes/menu/Menu";
import Chefs from "./rightPanes/chefs/Chefs";
import Waiters from "./rightPanes/waiters/Waiters";
import Category from "./rightPanes/categories/Categories";
import Notifications from "./rightPanes/notifications/Notifications";
import {
  setAdminStatus,
  changeNavbarColor,
  changeMainContentType,
  MENU_DETAILS,
  ORDER_DETAILS,
  TABLE_DETAILS,
  CHEF_DETAILS,
  WAITER_DETAILS,
  CATEGORY_DETAILS,
  NOTIFICATION_DETAILS,
  MASTER_ADMIN,
  RESTAURANT_ADMIN
} from "../../actions/navigationActions";
import { fetchChefs } from "../../actions/chefsActions";
import { fetchCategories, resetMenu } from "../../actions/menuActions";
import {
  fetchCurrentRestaurant,
  resetCurrentRestaurant
} from "../../views/RestaurantPage/restaurantActions";
import { fetchTables } from "../../actions/tablesActions";
import { fetchWaiters } from "../../actions/waitersActions";
import {
  fetchOrders,
  fetchActiveOrders
} from "./rightPanes/orders/ordersActions";
class Dashboard extends React.Component {
  componentDidMount() {
    //Changing the navbar color
    if (this.props.navigation.navbarColor !== "white") {
      this.props.dispatch(changeNavbarColor("white"));
    }
    //setting the current restaurant
    const { restaurantId } = this.props.match.params;
    this.props.dispatch(fetchCurrentRestaurant(restaurantId));

    // Fetching the data pre-hand to imporve the speed
    this.props.dispatch(fetchCategories(restaurantId));
    this.props.dispatch(fetchTables(restaurantId));
    this.props.dispatch(fetchChefs(restaurantId));
    this.props.dispatch(fetchWaiters(restaurantId));
    this.props.dispatch(fetchOrders(restaurantId));
    this.props.dispatch(fetchActiveOrders(restaurantId));
    //Setting the default tab for dashboard
    this.props.dispatch(changeMainContentType());
  }
  componentWillUnmount() {
    this.props.dispatch(resetMenu());
    this.props.dispatch(resetCurrentRestaurant());
  }
  render() {
    const { classes } = this.props;
    const { restaurantId } = this.props.match.params;
    //set admin status
    const { user, isAdmin } = this.props.navigation;
    if (user) {
      const isAdminTemp =
        user.type === MASTER_ADMIN ||
        (user.restaurantId === restaurantId && user.type === RESTAURANT_ADMIN);
      if (isAdminTemp !== isAdmin) {
        this.props.dispatch(setAdminStatus(isAdminTemp));
      }
    }
    return (
      <div className={classes.root}>
        <DrawerContent />
        <main className="content">
          <div className={classes.toolbar} />
          {this.showRightPane(
            this.props.navigation.mainContentType,
            restaurantId
          )}
        </main>
      </div>
    );
  }

  showRightPane(name, restaurantId) {
    switch (name) {
      case ORDER_DETAILS.name:
        return <Orders restaurantId={restaurantId} />;
      case TABLE_DETAILS.name:
        return <Tables restaurantId={restaurantId} />;
      case CHEF_DETAILS.name:
        return <Chefs restaurantId={restaurantId} />;
      case WAITER_DETAILS.name:
        return <Waiters restaurantId={restaurantId} />;
      case CATEGORY_DETAILS.name:
        return <Category restaurantId={restaurantId} />;
      case NOTIFICATION_DETAILS.name:
        return <Notifications restaurantId={restaurantId} />;
      case MENU_DETAILS.name:
      default:
        return <Menu restaurantId={restaurantId} />;
    }
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  match: PropTypes.object
};

const mapStateToProps = state => {
  return {
    navigation: state.NavigationReducer
  };
};
export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(Dashboard)
);
