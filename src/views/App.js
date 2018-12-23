import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
import Dashboard from "./Dashboard/Dashboard";
import RestaurantPage from "./RestaurantPage/RestaurantPage";
import firebase from "firebase/app";
import "firebase/auth";
import { connect } from "react-redux";
import { logoutUser, fetchUser } from "../actions/navigationActions";
import Header from "../components/Header/Header";
import HeaderLinks from "../components/Header/HeaderLinks";
import Footer from "../components/Footer/Footer";
import PropTypes from "prop-types";
import MessagingComponent from "../components/MessagingComponent";
import UploadImageDialog from "./UploadImageDialog";
import "./App.css";
import { Offline } from "react-detect-offline";
import offlineImage from "../assets/img/offlineImage.svg";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
class App extends Component {
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      this.props.setUserStatus(user);
    });
  }
  render() {
    return (
      <div>
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
            <UploadImageDialog />
          </div>
        </BrowserRouter>
        <Offline>
          <Dialog open={true} aria-labelledby="responsive-dialog-title">
            <DialogContent className="offlineImgContainer">
              <img src={offlineImage} className="offlineImg" alt="offlineImg" />
            </DialogContent>
            <DialogTitle id="responsive-dialog-title">
              <h1 className="offlineText">You are offline</h1>
            </DialogTitle>
          </Dialog>
        </Offline>
      </div>
    );
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
  setUserStatus: PropTypes.func,
  dispatch: PropTypes.func
};

export default connect(
  null,
  mapDispatchToProps
)(App);
