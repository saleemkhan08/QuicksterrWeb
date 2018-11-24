import React from "react";
import EditDialog from "../../../../components/dialogs/EditDialog";
import PropTypes from "prop-types";
import IntegratedReactSelect from "../../../IntegratedReactSelect";
import { connect } from "react-redux";
import { fetchUsers } from "../../../../actions/navigationActions";
class AddWaiterDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      email: ""
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchUsers());
  }

  render() {
    const { users } = this.props.navigationReducer;
    const labledUsers = [];
    if (users) {
      const uids = Object.keys(users);
      uids.forEach(uid => {
        const user = users[uid];
        labledUsers.push({
          label: user.email,
          value: user.email
        });
      });
    }
    return (
      <div>
        <EditDialog
          open={this.props.open}
          heading="Add New Waiter"
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        >
          <IntegratedReactSelect
            label="Waiter's Email ID"
            onChange={str => this.updateList(str)}
            suggestions={labledUsers}
          />
        </EditDialog>
      </div>
    );
  }

  updateList = email => {
    console.log("updateList : email : ", email);
    this.setState({
      email: email
    });
  };

  handleSave() {
    this.props.handleAddSave(this.state.email);
    this.setState({
      email: ""
    });
  }

  handleCancel() {
    this.props.handleCancel();
  }
}

AddWaiterDialog.propTypes = {
  handleCancel: PropTypes.func,
  handleAddSave: PropTypes.func,
  open: PropTypes.bool,
  navigationReducer: PropTypes.object,
  dispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    navigationReducer: state.NavigationReducer
  };
};

export default connect(mapStateToProps)(AddWaiterDialog);
