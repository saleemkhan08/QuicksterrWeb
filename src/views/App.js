import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
import Dashboard from "./Dashboard/Dashboard";
import RestaurantPage from "./RestaurantPage/RestaurantPage";
import firebase from "firebase/app";
import "firebase/auth";
import { connect } from "react-redux";
import { logoutUser, fetchUser } from "../actions/authActions";
import Header from "../components/Header/Header";
import HeaderLinks from "../components/Header/HeaderLinks";
import Footer from "components/Footer/Footer";
import PropTypes from "prop-types";
import MessagingComponent from "../components/MessagingComponent";
import "./App.css";
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header
            brand="Queue Breaker"
            fixed
            changeColorOnScroll={{
              height: 200,
              color: "white"
            }}
          >
            <HeaderLinks />
          </Header>
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/dashboard/:restaurantId" component={Dashboard} />
            <Route path="/restaurants" component={RestaurantPage} />
          </Switch>
          <Footer />
          <MessagingComponent />
        </div>
      </BrowserRouter>
    );
  }
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      this.props.setUserStatus(user);
    });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUserStatus: user => {
      if (user) {
        dispatch(fetchUser(user.uid));
      } else {
        dispatch(logoutUser());
      }
    }
  };
};

App.propTypes = {
  setUserStatus: PropTypes.func
};

export default connect(
  null,
  mapDispatchToProps
)(App);
