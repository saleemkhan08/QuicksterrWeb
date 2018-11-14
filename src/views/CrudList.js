import React, { Component } from "react";
import EditIcon from "@material-ui/icons/Edit";
import ClearIcon from "@material-ui/icons/Clear";
import CameraAlt from "@material-ui/icons/CameraAlt";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Paper from "@material-ui/core/Paper";
import GridContainer from "../components/Grid/GridContainer";
import GridItem from "../components/Grid/GridItem";
import styles from "./Dashboard/rightPanes/styles";
import { IconButton, CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MenuItemCard from "../views/Dashboard/rightPanes/menu/MenuItemCard";
import OrderItemCard from "../views/Dashboard/rightPanes/orders/OrderItemCard";
import { RESTAURANTS } from "../actions/restaurantActions";
import {
  CircularLoading,
  CenteredText
} from "../components/Centered/CenteredUtils";
import DeleteDialog from "../components/dialogs/DeleteDialog";
import {
  RESTAURANT_DETAILS,
  MENU_ITEM_DETAILS,
  ORDER_DETAILS,
  NOTIFICATION_DETAILS,
  TABLE_DETAILS,
  CATEGORY_DETAILS,
  IMAGES_DETAILS
} from "../actions/navigationActions";
import { openImageUploadDialog } from "../actions/imagesActions";
import Button from "@material-ui/core/Button";
import { TABLES } from "../actions/tablesActions";
import { CATEGORIES } from "../actions/menuActions";
class CRUDList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openUploadImgDialog: false,
      openDialog: false,
      deleteAlertMsg: "",
      name: "",
      key: "",
      showAdminOptions: false
    };
    this.handleDeleteAccepted = this.handleDeleteAccepted.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  render() {
    const { items, detail, reducer, showUploadingCard } = this.props;
    return (
      <div>
        {this.getBreadCrumb(detail, reducer)}
        <GridContainer>
          {this.getLoadingCard(showUploadingCard, "Uploading...")}
          {this.showRows(items, detail)}
        </GridContainer>
        {this.props.navigation.isAdmin ? (
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

  getBreadCrumb(detail, reducer) {
    if (
      this.props.hideBreadCrumb ||
      this.props.isLoading ||
      this.props.reducer.isCurrentRestaurantLoading
    ) {
      return "";
    }
    return (
      <div className="bread-crumb-container">
        <h3 className="bread-crumb-title">
          {this.getBreadCrumbTitle(detail, reducer)}
          <span className="bread-crumb-title-btn-container">
            {this.getAddButton()}
            {this.props.children}
          </span>
        </h3>
        <div className="bread-crumb-btn-container">
          {this.getAddButton()}
          {this.props.children}
        </div>
      </div>
    );
  }

  getBreadCrumbTitle(detail, reducer) {
    if (detail.name === undefined) {
      return "";
    } else if (
      detail.name === RESTAURANT_DETAILS.name ||
      detail.name === NOTIFICATION_DETAILS.name
    ) {
      return detail.name;
    } else if (reducer.currentRestaurant) {
      const restaurantName = reducer.currentRestaurant.name;
      return (
        <span>
          <strong style={{ fontWeight: 400 }}> {restaurantName} </strong>
          {" - "}
          {detail.name}
        </span>
      );
    } else {
      return "";
    }
  }

  getAddButton() {
    if (this.props.navigation.isAdmin && !this.props.hideAddBtn) {
      return (
        <Button
          variant="outlined"
          aria-label="Add"
          color="primary"
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
    this.setState({ openDialog: false, objectDeleted: undefined });
  };

  handleDeleteAccepted() {
    this.setState({ openDialog: false });
    this.props.handleDelete(this.state.objectDeleted);
  }

  handleDeleteClick(item) {
    let deleteMsg = this.props.detail.deleteConfirmMsgStart;
    if (this.props.detail.deleteConfirmMsgEnd) {
      deleteMsg += item.name + this.props.detail.deleteConfirmMsgEnd;
    }
    if (this.props.detail.deleteConfirmMsgStart) {
      this.setState({
        name: item.name,
        key: item.id,
        objectDeleted: item.object,
        openDialog: true,
        deleteAlertMsg: deleteMsg
      });
    } else {
      this.props.handleDelete(this.state.objectDeleted);
    }
  }

  showRows(items, detail) {
    if (
      this.props.isLoading ||
      this.props.reducer.isCurrentRestaurantLoading ||
      items === undefined
    ) {
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
                handleEdit={this.props.handleEdit}
                showAdminOptions={this.props.navigation.isAdmin}
              />
            );
          case ORDER_DETAILS.type:
            return (
              <OrderItemCard
                key={item.id}
                item={item}
                handleDeleteClick={this.handleDeleteClick}
                handleEdit={this.props.handleEdit}
              />
            );
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
    if (this.state.objectDeleted && this.state.objectDeleted.id === item.id) {
      return this.getLoadingCard(true, "Deleting...");
    }
    return (
      <GridItem xs={12} sm={6} md={4} key={item.id}>
        <div>
          <Paper className="default-card">
            {this.getAdminOptions(item)}
            <div className="default-container">
              <div className="default-cardImg-container">
                {icon.includes(".svg") ? (
                  <img
                    src={icon}
                    alt="..."
                    className="default-cardImg-contain"
                    onClick={() => this.onLinkClick(item)}
                  />
                ) : (
                  <img
                    src={icon}
                    alt="..."
                    className="default-cardImg"
                    onClick={() => this.onLinkClick(item)}
                  />
                )}
                {this.showImgUploadBtn(item)}
              </div>
              <Link to={link} className="default-link">
                <div
                  className="default-textContainer"
                  onClick={() => this.onLinkClick(item)}
                >
                  <p className="default-cardHeading">{item.name}</p>
                  <p className="default-cardDescription">{item.description}</p>
                </div>
              </Link>
            </div>
          </Paper>
        </div>
      </GridItem>
    );
  }

  getLoadingCard(loading, text) {
    if (loading) {
      return (
        <GridItem xs={12} sm={6} md={4}>
          <div>
            <Paper className="default-card">
              <div className="default-container">
                <div className="default-loading-container">
                  <div className="default-loading-inner-container">
                    <CircularProgress className="default-loading" />
                    <h5 className="default-loading-text">{text}</h5>
                  </div>
                </div>
              </div>
            </Paper>
          </div>
        </GridItem>
      );
    }
  }

  showImgUploadBtn = item => {
    if (this.props.navigation.isAdmin && this.props.showImgUploadBtn) {
      return (
        <IconButton
          className="img-upload-btn"
          onClick={() => {
            let keywords = "Abstract";
            let refPath = undefined;
            switch (this.props.detail.type) {
              case RESTAURANT_DETAILS.type:
                keywords = "Restaurant Logo";
                refPath = RESTAURANTS + "/" + item.id;
                break;
              case TABLE_DETAILS.type: {
                const { restaurantId } = this.props.reducer.currentRestaurant;
                keywords = "Table Image";
                refPath =
                  RESTAURANTS +
                  "/" +
                  restaurantId +
                  "/" +
                  TABLES +
                  "/" +
                  item.id;
                break;
              }
              case CATEGORY_DETAILS.type: {
                const { restaurantId } = this.props.reducer.currentRestaurant;
                refPath =
                  RESTAURANTS +
                  "/" +
                  restaurantId +
                  "/" +
                  CATEGORIES +
                  "/" +
                  item.id;
                keywords = item.name;
                break;
              }
            }
            this.props.dispatch(openImageUploadDialog(keywords, refPath));
          }}
        >
          <CameraAlt />
        </IconButton>
      );
    }
  };
  onLinkClick = item => {
    switch (this.props.detail.name) {
      case RESTAURANT_DETAILS.name:
      case IMAGES_DETAILS.name:
        this.props.onLinkClick(item);
        break;
    }
  };
  getAdminOptions(item) {
    if (this.props.navigation.isAdmin) {
      return (
        <div>
          <IconButton className="default-closeBtn" size="small">
            <ClearIcon onClick={() => this.handleDeleteClick(item)} />
          </IconButton>
          {this.props.hideEdit ? (
            ""
          ) : (
            <IconButton
              className={
                this.props.horizontal
                  ? "default-editBtn-horizontal"
                  : "default-editBtn"
              }
              size="small"
            >
              <EditIcon onClick={() => this.props.handleEdit(item.object)} />
            </IconButton>
          )}
        </div>
      );
    }
  }
}

CRUDList.propTypes = {
  showUploadingCard: PropTypes.bool,
  items: PropTypes.array,
  detail: PropTypes.object,
  handleEdit: PropTypes.func,
  hideEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleAdd: PropTypes.func,
  reducer: PropTypes.object,
  navigation: PropTypes.object,
  children: PropTypes.node,
  hideAddBtn: PropTypes.bool,
  onLinkClick: PropTypes.func,
  horizontal: PropTypes.bool,
  dispatch: PropTypes.func,
  showImgUploadBtn: PropTypes.bool,
  hideBreadCrumb: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    reducer: state.RestaurantReducer,
    navigation: state.NavigationReducer
  };
};

export default connect(mapStateToProps)(withStyles(styles)(CRUDList));
