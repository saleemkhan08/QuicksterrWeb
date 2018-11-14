import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";
import InputIcon from "@material-ui/icons/Input";
import AddIcon from "@material-ui/icons/Add";
import menu from "../../../../assets/img/sidebar-icons/menu.svg";
import { connect } from "react-redux";
import nested from "../../../../assets/img/sidebar-icons/chevron-right.svg";
import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  setCurrentCategory,
  addCategories,
  editCategories,
  deleteCategories,
  deleteCategory,
  addCategory
} from "../../../../actions/menuActions";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import "./MenuStyle.css";
import AddCategoryDialog from "./AddCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import ReactFileReader from "react-file-reader";
import csv from "csvtojson";
import {
  fetchAndDeleteDishes,
  addMenuItems
} from "../../../../actions/dishesActions";
import { from } from "rxjs/observable/from";
import { map } from "rxjs/operators";
import { async } from "rxjs/scheduler/async";
import { MENU_DETAILS } from "../../../../actions/navigationActions";
import DeleteDialog from "../../../../components/dialogs/DeleteDialog";

const IMPORTING = "Importing...";
const IMPORT_MENU = "Import Menu";
class MenuDrawerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openEditDialog: false,
      openAddDialog: false,
      category: undefined,
      openDeleteDialog: false,
      importText: IMPORT_MENU,
      isImporting: false,
      newListOfCategories: undefined,
      showAdminOptions: false
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEditSave = this.handleEditSave.bind(this);
    this.handleAddSave = this.handleAddSave.bind(this);
    this.handleImport = this.handleImport.bind(this);
  }

  render() {
    const { expand, handleMenuExpand } = this.props;
    const { categories, isLoading } = this.props.reducer;
    const menuLink = { name: "Menu", icon: menu };
    const currentCategoryName =
      this.state.category !== undefined ? this.state.category.name : "this";
    let expandCategories = expand;
    if (this.state.openAddDialog) {
      expandCategories = false;
    }
    return (
      <div>
        {this.showListItem(menuLink, handleMenuExpand)}
        <Collapse in={expandCategories} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {this.showCategories(categories, isLoading)}
          </List>
          {this.showImportButton()}
        </Collapse>

        {this.addAdminOptionsDialogs(currentCategoryName)}
      </div>
    );
  }

  addAdminOptionsDialogs(currentCategoryName) {
    if (this.state.showAdminOptions)
      return (
        <div>
          <AddCategoryDialog
            open={this.state.openAddDialog}
            handleAddSave={this.handleAddSave}
            handleCancel={this.handleCancel}
          />
          <EditCategoryDialog
            open={this.state.openEditDialog}
            handleEditSave={this.handleEditSave}
            handleCancel={this.handleCancel}
            category={this.state.category}
          />
          <DeleteDialog
            openDialog={this.state.openDeleteDialog}
            handleClose={this.handleCancel}
            deleteAlertMsg={
              MENU_DETAILS.deleteConfirmMsgStart +
              currentCategoryName +
              MENU_DETAILS.deleteConfirmMsgEnd
            }
            handleDeleteAccepted={this.handleDeleteAccepted}
          />
        </div>
      );
  }

  showImportButton() {
    if (this.state.showAdminOptions)
      return (
        <ReactFileReader handleFiles={this.handleImport} fileTypes={".csv"}>
          <div className="drawer-item-container">
            <Button
              variant="outlined"
              color="primary"
              className="drawer-item"
              disabled={this.state.isImporting}
            >
              <InputIcon style={{ marginRight: "15px" }} />{" "}
              {this.state.importText}
              <CircularProgress
                className={this.state.isImporting ? "" : "hide-progress"}
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "15px"
                }}
              />
            </Button>
          </div>
        </ReactFileReader>
      );
  }

  handleImport = files => {
    this.setState({
      importText: IMPORTING,
      isImporting: true
    });
    this.readCsvFileToString(files[0]);
  };

  readCsvFileToString = csvFile => {
    let reader = new FileReader();
    reader.readAsText(csvFile);
    reader.onload = () => this.onCsvFileRead(reader.result);
  };

  onCsvFileRead = csvStr => {
    csv()
      .fromString(csvStr)
      .then(json => this.convertJsonToCategoryTree(json));
  };

  convertJsonToCategoryTree = json => {
    const listOfCategories = {};
    for (let i = 0; i < json.length; i++) {
      const dish = this.mapJsonToDish(json[i]);
      const category = json[i].category;
      if (listOfCategories[category] !== undefined) {
        listOfCategories[category].push(dish);
      } else if (category !== undefined && category.trim() !== "") {
        listOfCategories[category] = [];
        listOfCategories[category].push(dish);
      }
    }
    const { categories } = this.props.reducer;
    if (categories.length > 0) {
      this.setState({
        oldCategoryCount: categories.length
      });
      this.deleteDishesInCategories(listOfCategories, categories);
    } else {
      this.addAllCategories(listOfCategories);
    }

    //add all the categories
    //add all the dishes in each categories
  };

  deleteDishesInCategories = (listOfCategories, categories) => {
    const { currentRestaurant } = this.props.restaurantReducer;
    const currentRestaurantId = currentRestaurant.restaurantId;
    const source = from(categories, async);
    const observable = source
      .pipe(
        map(category => fetchAndDeleteDishes(currentRestaurantId, category.id))
      )
      .pipe(
        map(categoryPromise => {
          return new Promise((resolve, reject) => {
            categoryPromise.then(id => {
              deleteCategory(currentRestaurantId, id)
                .then(() => resolve())
                .catch(err => reject(err));
            });
          });
        })
      );
    observable.subscribe(emptyPromise => {
      emptyPromise.then(
        () => {
          this.setState({
            oldCategoryCount: this.state.oldCategoryCount - 1
          });

          if (this.state.oldCategoryCount <= 0) {
            this.addAllCategories(listOfCategories);
          }
        },
        error => console.log("error", error)
      );
    });
  };

  addAllCategories(jsonOfCategoriesAndDishes) {
    const categoryList = Object.keys(jsonOfCategoriesAndDishes);
    this.setState({
      newCategoryCount: categoryList.length
    });
    const { currentRestaurant } = this.props.restaurantReducer;
    const currentRestaurantId = currentRestaurant.restaurantId;
    const source = from(categoryList, async);
    source
      .pipe(map(categoryName => addCategory(currentRestaurantId, categoryName)))
      .pipe(
        map(categoryPromise => {
          return new Promise((resolve, reject) => {
            categoryPromise
              .then(category => {
                addMenuItems(
                  currentRestaurantId,
                  category.id,
                  jsonOfCategoriesAndDishes[category.name]
                ).then(() => {
                  resolve();
                });
              })
              .catch(err => reject(err));
          });
        })
      )
      .subscribe(
        emptyPromise => {
          emptyPromise.then(() => {
            this.setState({
              newCategoryCount: this.state.newCategoryCount - 1
            });
            this.enableImport();
          });
        },
        error => console.log("error", error)
      );
  }

  enableImport = () => {
    if (this.state.newCategoryCount <= 0) {
      this.setState({
        importText: IMPORT_MENU,
        isImporting: false
      });
    }
  };
  mapJsonToDish = json => {
    const dish = {};
    dish["active"] = this.checkAndTrim(json, "active");
    dish["description"] = this.checkAndTrim(json, "description");
    dish["name"] = this.checkAndTrim(json, "name");
    dish["packingCharge"] = this.checkAndTrim(json, "packingCharge");
    dish["price"] = this.checkAndTrim(json, "price");
    dish["serviceCharge"] = this.checkAndTrim(json, "serviceCharge");
    dish["tax"] = this.checkAndTrim(json, "tax");
    dish["variant"] = this.checkAndTrim(json, "variant");
    dish["veg"] = this.checkAndTrim(json, "veg");
    return dish;
  };

  checkAndTrim = (json, property) => {
    return json[property] !== undefined ? json[property].trim() : "";
  };

  showListItem(link, handleItemClick) {
    const isActiveItem = this.props.activeItem === link.name;
    return (
      <div>
        <ListItem
          button
          key={link.name}
          selected={isActiveItem}
          className="sidebar-item"
          onClick={() => {
            if (!this.state.openAddDialog) handleItemClick(link.name);
          }}
        >
          <ListItemIcon>
            <img src={link.icon} className="sidebar-icons" alt="" />
          </ListItemIcon>
          {this.state.showAdminOptions ? (
            <IconButton
              aria-label="Add"
              className="actionBtn"
              onClick={this.handleAdd}
            >
              <AddIcon />
            </IconButton>
          ) : (
            ""
          )}

          <ListItemText
            primary={link.name}
            className={
              isActiveItem ? "sidebar-item-active-text" : "sidebar-item-text"
            }
          />
          {this.showExpandIcon(() => handleItemClick(link.name))}
        </ListItem>
      </div>
    );
  }

  showCategories(categories, isLoading) {
    if (isLoading) {
      return this.showDrawerItemText("Loading");
    } else if (categories.length > 0) {
      return categories.map(category => {
        return this.showSubListItem(category);
      });
    } else {
      return this.showDrawerItemText("No Categories Found...");
    }
  }

  showDrawerItemText(text) {
    return (
      <div className="drawer-item-container">
        <p className="drawer-item drawer-item-text">{text}</p>
      </div>
    );
  }

  getActiveItem(category) {
    const { currentCategory } = this.props.reducer;
    try {
      return currentCategory.name === category.name;
    } catch (error) {
      return false;
    }
  }
  showSubListItem(category) {
    const isActiveItem = this.getActiveItem(category);
    return (
      <ListItem
        button
        key={category.name}
        className="sidebar-item nested"
        onClick={() => {
          this.props.dispatch(setCurrentCategory(category));
          this.props.handleItemClick("Menu");
        }}
      >
        <ListItemIcon>
          <img src={nested} className="sidebar-icons" alt="" />
        </ListItemIcon>
        <ListItemText
          inset
          primary={category.name}
          className={
            isActiveItem ? "sidebar-item-active-text" : "sidebar-item-text"
          }
        />
        {this.state.showAdminOptions ? (
          <ListItemSecondaryAction>
            <IconButton
              aria-label="Edit"
              className="actionBtn"
              onClick={() => this.handleEdit(category)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="Delete"
              className="actionBtn"
              onClick={() => this.handleDelete(category)}
            >
              <ClearIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ) : (
          ""
        )}
      </ListItem>
    );
  }
  showExpandIcon(handleClick) {
    return this.props.expand ? (
      <ExpandLess onClick={handleClick} />
    ) : (
      <ExpandMore onClick={handleClick} />
    );
  }

  handleAdd() {
    this.setState({
      openEditDialog: false,
      openAddDialog: true,
      openDeleteDialog: false,
      category: undefined
    });
  }

  handleEditSave(category) {
    this.props.dispatch(
      editCategories(
        this.props.restaurantReducer.currentRestaurant.restaurantId,
        category
      )
    );
    this.setState({
      openEditDialog: false
    });
  }
  handleAddSave(category) {
    this.props.dispatch(
      addCategories(
        this.props.restaurantReducer.currentRestaurant.restaurantId,
        category
      )
    );
    this.setState({
      openAddDialog: false
    });
  }

  handleCancel() {
    this.setState({
      openEditDialog: false,
      openAddDialog: false,
      openDeleteDialog: false
    });
  }

  handleDelete(category) {
    this.setState({
      category,
      openDeleteDialog: true
    });
  }
  handleDeleteAccepted() {
    this.props.dispatch(
      deleteCategories(
        this.props.restaurantReducer.currentRestaurant.restaurantId,
        this.state.category
      )
    );
    this.setState({
      openDeleteDialog: false
    });
  }

  handleEdit(category) {
    this.setState({
      openEditDialog: true,
      openAddDialog: false,
      openDeleteDialog: false,
      category: category
    });
  }
}

MenuDrawerList.propTypes = {
  dispatch: PropTypes.func,
  reducer: PropTypes.object,
  expand: PropTypes.bool,
  handleMenuExpand: PropTypes.func,
  activeItem: PropTypes.string,
  handleItemClick: PropTypes.func,
  restaurantReducer: PropTypes.object
};

const mapStateToProps = state => {
  return {
    reducer: state.MenuReducer,
    restaurantReducer: state.RestaurantReducer
  };
};

export default connect(mapStateToProps)(MenuDrawerList);
