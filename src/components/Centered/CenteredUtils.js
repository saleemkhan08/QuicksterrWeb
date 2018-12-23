import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import "./Centered.css";
import PropTypes from "prop-types";
export const CircularLoading = props => {
  return (
    <div className="centered-container">
      <div className="flex-center">
        <div className="centered-container">
          <CircularProgress className="centered-progress" />
          <h3 className="centered-text">
            {props.msg ? props.msg : "Loading..."}
          </h3>
        </div>
      </div>
    </div>
  );
};
CircularLoading.propTypes = {
  msg: PropTypes.string
};
export const CenteredText = props => {
  return (
    <div className="centered-container">
      <div className="flex-center">
        <div className="centered-container">
          <h3 className="centered-text">{props.msg}</h3>
        </div>
      </div>
    </div>
  );
};
CenteredText.propTypes = {
  msg: PropTypes.string
};
export const SearchBar = props => {
  return (
    <Paper>
      <div className="search-field-container">
        <Input
          disableUnderline
          onChange={event => props.onChange(event)}
          value={props.searchStr}
          className="search-field"
          placeholder="Search..."
        />
        <IconButton>
          <SearchIcon />
        </IconButton>
      </div>
    </Paper>
  );
};
SearchBar.propTypes = {
  searchStr: PropTypes.string,
  onChange: PropTypes.func.isRequired
};
