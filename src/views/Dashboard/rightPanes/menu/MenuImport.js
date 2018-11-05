import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import InputIcon from "@material-ui/icons/Input";
import Button from "@material-ui/core/Button";
import ReactFileReader from "react-file-reader";
import "./MenuStyle.css";
import { deleteCategory, addCategory } from "../../../../actions/menuActions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import csv from "csvtojson";
import {
  fetchAndDeleteDishes,
  addMenuItems
} from "../../../../actions/dishesActions";
import { from } from "rxjs/observable/from";
import { map } from "rxjs/operators";
import { async } from "rxjs/scheduler/async";
import CircularProgress from "@material-ui/core/CircularProgress";

const IMPORTING = "Importing...";
const IMPORT_MENU = "Import Menu";
class MenuImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      importText: IMPORT_MENU,
      isImporting: false
    };
  }
  render() {
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
            </Button>
          </div>
        </ReactFileReader>
        <Dialog
          open={this.state.isImporting}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle className="import-status-message">
            {this.state.importText}
          </DialogTitle>
          <CircularProgress className="center-progress" />
        </Dialog>
      </div>
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
    this.setState({
      importText: "Reading CSV file..."
    });
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
  };
  deleteDishesInCategories = (listOfCategories, categories) => {
    this.setState({
      importText: "Deleting Existing Menu"
    });
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
        error => this.props.onMenuImportError(error)
      );
    });
  };
  addAllCategories(jsonOfCategoriesAndDishes) {
    this.setState({
      importText: "Adding New Menu"
    });
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
        error => this.props.onMenuImportError(error)
      );
  }
  enableImport = () => {
    if (this.state.newCategoryCount <= 0) {
      this.setState({
        importText: IMPORT_MENU,
        isImporting: false
      });
      this.props.onMenuImported();
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

MenuImport.propTypes = {
  restaurantId: PropTypes.string,
  dispatch: PropTypes.func,
  menuReducer: PropTypes.object,
  heading: PropTypes.string,
  restaurantReducer: PropTypes.object,
  onMenuImported: PropTypes.func,
  onMenuImportError: PropTypes.func
};
const mapStateToProps = state => {
  return {
    menuReducer: state.MenuReducer,
    restaurantReducer: state.RestaurantReducer
  };
};

export default connect(mapStateToProps)(MenuImport);
