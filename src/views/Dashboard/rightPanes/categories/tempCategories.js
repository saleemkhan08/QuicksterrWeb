import React, { Component } from "react";
import PropTypes from "prop-types";
import { fetchCategories } from "../../../../actions/menuActions";
import { connect } from "react-redux";
import CRUDList from "../../../CrudList";

import {
  CATEGORY_DETAILS,
  MENU_DETAILS
} from "../../../../actions/navigationActions";
import InputIcon from "@material-ui/icons/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import ReactFileReader from "react-file-reader";
import "./Category.css";
import AddCategoryDialog from "./AddCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteDialog from "../../../../components/dialogs/DeleteDialog";
import {
  setCurrentCategory,
  addCategories,
  editCategories,
  deleteCategories,
  deleteCategory,
  addCategory
} from "../../../../actions/menuActions";
import csv from "csvtojson";
import {
  fetchAndDeleteDishes,
  addMenuItems
} from "../../../../actions/dishesActions";
import { from } from "rxjs/observable/from";
import { map } from "rxjs/operators";
import { async } from "rxjs/scheduler/async";
/*
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";

import AddIcon from "@material-ui/icons/Add";
import menu from "../../../../assets/img/sidebar-icons/menu.svg";
import nested from "../../../../assets/img/sidebar-icons/chevron-right.svg";
import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import "./MenuStyle.css";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

*/
const IMPORTING = "Importing...";
const IMPORT_MENU = "Import Menu";

class Category extends Component {
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

  componentDidMount() {
    const { restaurantId } = this.props;
    this.props.dispatch(fetchCategories(restaurantId));
  }
  render() {
    const { categories, isLoading } = this.props.menuReducer;
    return (
      <CRUDList
        items={categories}
        detail={CATEGORY_DETAILS}
        isLoading={isLoading}
      >
        {this.showImportButton()}
      </CRUDList>
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
    if (this.props.navigationReducer.isAdmin)
      return (
        <div className="import-btn-outer-container">
          <ReactFileReader handleFiles={this.handleImport} fileTypes={".csv"}>
            <div className="import-btn-inner-container">
              <Button
                variant="outlined"
                color="primary"
                className="import-btn"
                disabled={this.state.isImporting}
              >
                <InputIcon style={{ marginRight: "15px" }} />
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
        </div>
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
    const { categories } = this.props.menuReducer;
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
}
Category.propTypes = {
  restaurantId: PropTypes.string,
  dispatch: PropTypes.func,
  menuReducer: PropTypes.object,
  heading: PropTypes.string,
  navigationReducer: PropTypes.object,
  restaurantReducer: PropTypes.object
};
const mapStateToProps = state => {
  return {
    menuReducer: state.MenuReducer,
    navigationReducer: state.NavigationReducer,
    restaurantReducer: state.RestaurantReducer
  };
};

export default connect(mapStateToProps)(Category);
