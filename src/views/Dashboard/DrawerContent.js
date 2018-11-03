// This file is shared across the demos.

import React, { Component } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import Divider from "@material-ui/core/Divider";
import closeDrawer from "../../assets/img/sidebar-icons/chevron-close.svg";
import openDrawer from "../../assets/img/sidebar-icons/chevron-open.svg";
import "./Dashboard.css";
import { styles } from "./DashboardStyle";
import { changeMainContentType } from "../../actions/authActions";
import { connect } from "react-redux";
import { sidebarLinks, MENU_DETAILS } from "../../actions/authActions";

import MenuDrawerList from "./rightPanes/menu/MenuDrawerList";

class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      expand: false,
      activeItem: MENU_DETAILS.name
    };
    this.handleMenuExpand = this.handleMenuExpand.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleDrawer = () => {
    // current user is admin/ master admin
    if (this.state.open) {
      this.setState({ expand: false, open: false });
    } else {
      this.setState({ open: true });
    }
  };

  render() {
    const { classes } = this.props;
    const { displayCategories, isLoading } = this.props.reducer;
    const marginTopHeight =
      displayCategories && !isLoading
        ? { height: "120px" }
        : { height: "75px" };
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: classNames(
            classes.drawerPaper,
            !this.state.open && classes.drawerPaperClose
          )
        }}
        open={this.state.open}
      >
        <div style={marginTopHeight} />
        <ListItem button onClick={this.handleDrawer} className="sidebar-item">
          <ListItemIcon>
            <img
              src={this.state.open ? closeDrawer : openDrawer}
              className="sidebar-icons"
              alt=""
            />
          </ListItemIcon>
          <ListItemText primary="Close" className="sidebar-item-text" />
        </ListItem>
        <Divider />
        <MenuDrawerList
          expand={this.state.expand}
          handleItemClick={this.handleItemClick}
          handleMenuExpand={this.handleMenuExpand}
          activeItem={this.state.activeItem}
        />
        {this.sideBarItems()}
      </Drawer>
    );
  }

  sideBarItems() {
    return sidebarLinks.map(link => {
      return this.showListItem(link, this.handleItemClick, "");
    });
  }

  showListItem(link, handleItemClick) {
    const isActiveItem = this.state.activeItem === link.name;
    return (
      <ListItem
        button
        key={link.name}
        selected={isActiveItem}
        className="sidebar-item"
        onClick={() => handleItemClick(link.name)}
      >
        <ListItemIcon>
          <img src={link.icon} className="sidebar-icons" alt="" />
        </ListItemIcon>
        <ListItemText
          primary={link.name}
          className={
            isActiveItem ? "sidebar-item-active-text" : "sidebar-item-text"
          }
        />
      </ListItem>
    );
  }

  handleMenuExpand() {
    this.setState({
      expand: !this.state.expand,
      open: true
    });
  }

  handleItemClick(name) {
    if (window.innerWidth < 600) {
      this.setState({ expand: false, open: false });
    }
    this.props.dispatch(changeMainContentType(name));
    this.setState({
      activeItem: name,
      expand: name === MENU_DETAILS.name
    });
  }
}

DrawerContent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  reducer: PropTypes.object
};

const mapStateToProps = state => {
  return {
    reducer: state.MenuReducer
  };
};

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(DrawerContent)
);
