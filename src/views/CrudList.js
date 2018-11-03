import React, { Component } from "react";
import EditIcon from "@material-ui/icons/Edit";
import ClearIcon from "@material-ui/icons/Clear";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Paper from "@material-ui/core/Paper";
import GridContainer from "../components/Grid/GridContainer";
import GridItem from "../components/Grid/GridItem";
import styles from "./Dashboard/rightPanes/styles";
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import MenuItemCard from "../views/Dashboard/rightPanes/menu/MenuItemCard";
import OrderItemCard from "../views/Dashboard/rightPanes/orders/OrderItemCard";
import TableItemCard from "../views/Dashboard/rightPanes/tables/TableItemCard";
import ChefItemCard from "../views/Dashboard/rightPanes/chefs/ChefItemCard";
import WaiterItemCard from "../views/Dashboard/rightPanes/waiters/WaiterItemCard";
import InventoryItemCard from "../views/Dashboard/rightPanes/inventory/InventoryItemCard";
import NotificationItemCard from "../views/Dashboard/rightPanes/notifications/NotificationItemCard";
import {
  CircularLoading,
  CenteredText
} from "../components/Centered/CenteredUtils";
import DeleteDialog from "../components/dialogs/DeleteDialog";
import {
  RESTAURANT_DETAILS,
  RESTAURANT_ADMIN,
  MASTER_ADMIN,
  MENU_ITEM_DETAILS,
  ORDER_DETAILS,
  TABLE_DETAILS,
  CHEF_DETAILS,
  WAITER_DETAILS,
  INVENTORY_DETAILS,
  NOTIFICATION_DETAILS
} from "../actions/authActions";
import Button from "@material-ui/core/Button";

class CRUDList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      deleteAlertMsg: "",
      name: "",
      key: "",
      showAdminOptions: false
    };
    this.handleDeleteAccepted = this.handleDeleteAccepted.bind(this);
  }

  componentDidUpdate() {
    const { user, restaurantId } = this.props.auth;
    const { currentRestaurant } = this.props.reducer;
    const showAdminOptions =
      user &&
      (user.type === MASTER_ADMIN ||
        (currentRestaurant &&
          user.type === RESTAURANT_ADMIN &&
          currentRestaurant.restaurantId === restaurantId));
    if (showAdminOptions !== this.state.showAdminOptions) {
      this.setState({
        showAdminOptions
      });
    }
  }
  render() {
    const { items, detail, reducer } = this.props;

    return (
      <div>
        {this.getBreadCrum(detail, reducer)}
        <GridContainer>{this.showRows(items, detail)}</GridContainer>
        {this.state.showAdminOptions ? (
          <DeleteDialog
            openDialog={this.state.openDialog}
            handleClose={this.handleClose}
            deleteAlertMsg={this.state.deleteAlertMsg}
            handleDeleteAccepted={this.handleDeleteAccepted}
          />
        ) : (
          ""
        )}
      </div>
    );
  }

  getBreadCrum(detail, reducer) {
    if (detail.name === RESTAURANT_DETAILS.name) {
      return (
        <h3>
          {detail.name}
          {this.getAddButton()}
        </h3>
      );
    } else if (reducer.currentRestaurant) {
      const restaurantName = reducer.currentRestaurant.name;
      return (
        <h3>
          <strong style={{ fontWeight: 400 }}> {restaurantName} </strong>
          {" - "}
          {detail.name}
          {this.getAddButton()}
          {this.props.children}
        </h3>
      );
    } else {
      return "";
    }
  }

  getAddButton() {
    if (this.state.showAdminOptions) {
      return (
        <Button
          variant="outlined"
          aria-label="Add"
          color="primary"
          style={{ marginLeft: "15px", boxShadow: "none" }}
          className="default-button"
          onClick={this.props.handleAdd}
        >
          <AddIcon style={{ marginRight: "10px" }} />
          Add
        </Button>
      );
    }
  }

  handleClose = () => {
    this.setState({ openDialog: false });
  };

  handleDeleteAccepted() {
    this.setState({ openDialog: false });
    this.props.handleDelete(this.state.objectDeleted);
  }

  handleDeleteClick(item) {
    if (this.props.detail.deleteConfirmMsgStart) {
      this.setState({
        name: item.name,
        key: item.id,
        objectDeleted: item.object,
        openDialog: true,
        deleteAlertMsg:
          this.props.detail.deleteConfirmMsgStart +
          item.name +
          this.props.detail.deleteConfirmMsgEnd
      });
    } else {
      this.props.handleDelete(this.state.objectDeleted);
    }
  }

  showRows(items, detail) {
    if (this.props.isLoading) {
      return <CircularLoading />;
    } else if (items.length > 0) {
      return items.map(item => {
        switch (detail.type) {
          case MENU_ITEM_DETAILS.type:
            return (
              <MenuItemCard
                key={item.id}
                item={item}
                handleDeleteClick={this.handleDeleteClick}
                handleEdit={this.handleEdit}
                showAdminOptions={this.state.showAdminOptions}
              />
            );
          case ORDER_DETAILS.type:
            return (
              <OrderItemCard
                key={item.id}
                item={item}
                handleDeleteClick={this.handleDeleteClick}
                handleEdit={this.handleEdit}
              />
            );
          // case TABLE_DETAILS.type:
          //   return (
          //     <TableItemCard
          //       key={item.id}
          //       item={item}
          //       handleDeleteClick={this.handleDeleteClick}
          //       handleEdit={this.handleEdit}
          //     />
          //   );
          // case CHEF_DETAILS.type:
          //   return (
          //     <ChefItemCard
          //       key={item.id}
          //       item={item}
          //       handleDeleteClick={this.handleDeleteClick}
          //     />
          //   );
          // case WAITER_DETAILS.type:
          //   return (
          //     <WaiterItemCard
          //       key={item.id}
          //       item={item}
          //       handleDeleteClick={this.handleDeleteClick}
          //     />
          //   );
          // case INVENTORY_DETAILS.type:
          //   return (
          //     <InventoryItemCard
          //       key={item.id}
          //       item={item}
          //       handleDeleteClick={this.handleDeleteClick}
          //       handleEdit={this.handleEdit}
          //     />
          //   );
          // case NOTIFICATION_DETAILS.type:
          //   return (
          //     <NotificationItemCard
          //       key={item.id}
          //       item={item}
          //       handleDeleteClick={this.handleDeleteClick}
          //     />
          //   );
          default:
            return this.getCard(item);
        }
      });
    } else {
      return <CenteredText msg={this.props.detail.emptyListMsg} />;
    }
  }

  getCard(item) {
    const icon = item.icon ? item.icon : this.props.detail.icon;
    const link = item.link ? item.link : "#";
    return (
      <GridItem xs={12} sm={6} md={4} key={item.id}>
        <div>
          <Paper className="default-card">
            {this.getAdminOptions(item)}

            <Link to={link}>
              <div className="default-container">
                <div className="default-cardImg-container">
                  <img src={icon} alt="..." className="default-cardImg" />
                </div>

                <div className="default-textContainer">
                  <p className="default-cardHeading">{item.name}</p>
                  <p className="default-cardDescription">{item.description}</p>
                </div>
              </div>
            </Link>
          </Paper>
        </div>
      </GridItem>
    );
  }

  getAdminOptions(item) {
    if (this.state.showAdminOptions) {
      return (
        <div>
          <IconButton className="default-closeBtn" size="small">
            <ClearIcon onClick={() => this.handleDeleteClick(item)} />
          </IconButton>
          {this.props.hideEdit ? (
            ""
          ) : (
            <IconButton className="default-editBtn" size="small">
              <EditIcon onClick={() => this.props.handleEdit(item.object)} />
            </IconButton>
          )}
        </div>
      );
    }
  }
}

CRUDList.propTypes = {
  items: PropTypes.array,
  detail: PropTypes.object,
  handleEdit: PropTypes.func,
  hideEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleAdd: PropTypes.func,
  reducer: PropTypes.object,
  auth: PropTypes.object,
  children: PropTypes.node
};

const mapStateToProps = state => {
  return {
    reducer: state.RestaurantReducer,
    auth: state.AuthReducer
  };
};

export default connect(mapStateToProps)(withStyles(styles)(CRUDList));
