import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import "./MenuStyle.css";
import { connect } from "react-redux";
import { setCurrentCategory } from "../../../../actions/menuActions";
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

class CategoryTabs extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.showRows = this.showRows.bind(this);
    this.state = {
      currentCategory: undefined
    };
  }

  handleChange(index) {
    const { categories } = this.props.reducer;
    this.props.dispatch(setCurrentCategory(categories[index]));
  }

  getCurrentCategoryIndex(categories, currentCategory) {
    let catIndex = 0;
    if (currentCategory) {
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].name === currentCategory.name) {
          catIndex = i;
        }
      }
    }
    return catIndex;
  }

  render() {
    const {
      displayCategories,
      categories,
      isLoading,
      currentCategory
    } = this.props.reducer;
    const value = this.getCurrentCategoryIndex(categories, currentCategory);

    if (displayCategories && !isLoading && categories.length > 0) {
      return (
        <div className="tabsContainer">
          <AppBar position="static" color="default" className="tabsAppBar">
            <Tabs
              value={value}
              onChange={(event, index) => this.handleChange(index)}
              indicatorColor="primary"
              textColor="primary"
              scrollable
              scrollButtons="on"
              fullWidth
              className="tabs"
            >
              {this.showRows(categories, currentCategory)}
            </Tabs>
          </AppBar>
        </div>
      );
    }
    return "";
  }
  showRows(items) {
    let category = this.props.reducer.currentCategory;
    category = category ? category : items[0];
    if (category !== this.state.currentCategory) {
      this.props.dispatch(setCurrentCategory(category));
      this.setState({
        currentCategory: category
      });
    }
    return items.map(item => {
      return this.getTab(item);
    });
  }
  getTab(item) {
    return <Tab key={item.name} label={item.name} className="tab-component" />;
  }
}

const mapStateToProps = state => {
  return {
    reducer: state.MenuReducer
  };
};

CategoryTabs.propTypes = {
  dispatch: PropTypes.func,
  reducer: PropTypes.object
};
export default connect(mapStateToProps)(CategoryTabs);
