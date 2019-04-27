/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
import { List, ListItem, withStyles } from "@material-ui/core";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import footerStyle from "../../assets/jss/material-kit-react/components/footerStyle.jsx";

function Footer({ ...props }) {
  const { classes, whiteFont } = props;
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className="footer">
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="/#about" className={classes.block}>
                About
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="/#pricing" className={classes.block}>
                Pricing
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="/#contact" className={classes.block}>
                Contact
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          Quicksterr &copy; {1900 + new Date().getYear()}
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool
};

export default withStyles(footerStyle)(Footer);
