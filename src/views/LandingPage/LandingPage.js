import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Parallax from "../../components/Parallax/Parallax.jsx";

import landingPageStyle from "../../assets/jss/material-kit-react/views/landingPage.jsx";

// Sections for this page
import ProductSection from "./Sections/ProductSection.jsx";
import TeamSection from "./Sections/TeamSection.jsx";
import WorkSection from "./Sections/WorkSection.jsx";
import { changeNavbarColor } from "../../actions/navigationActions";
import { connect } from "react-redux";
import { hideCategoriesTabs } from "../../actions/menuActions";
import PropTypes from "prop-types";
class LandingPage extends React.Component {
  componentDidMount() {
    if (this.props.navigation.navbarColor !== "transparent") {
      this.props.dispatch(changeNavbarColor("transparent"));
    }
    this.props.dispatch(hideCategoriesTabs());
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Parallax filter image={require("assets/img/landing-bg.jpg")}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <h1 className={classes.title}>Your Story Starts With Us.</h1>
                <h4>
                  Every landing page needs a small description after the big
                  bold title, thats why we added this text here. Add here all
                  the information that can make you or your product create the
                  first impression.
                </h4>
                <br />
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>
            <div id="about">
              <ProductSection />
            </div>
            <div id="pricing">
              <TeamSection />
            </div>
            <div id="contact">
              <WorkSection />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LandingPage.propTypes = {
  dispatch: PropTypes.func,
  classes: PropTypes.object,
  navigation: PropTypes.object
};

const mapStateToProps = state => {
  return {
    navigation: state.NavigationReducer
  };
};

export default connect(mapStateToProps)(
  withStyles(landingPageStyle)(LandingPage)
);
