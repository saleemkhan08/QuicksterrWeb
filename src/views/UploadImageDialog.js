import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import ReactFileReader from "react-file-reader";
import { connect } from "react-redux";
import KeywordsEditDialog from "./KeywordsEditDialog";
import {
  closeImageUploadDialog,
  uploadImage,
  editImageKeywords,
  deleteImage,
  updateImageUrl,
  fetchKeywords
} from "../actions/imagesActions";
import { IMAGES_DETAILS } from "../actions/navigationActions";
import { SearchBar } from "../components/Centered/CenteredUtils";
import CrudList from "./CrudList";

const styles = {
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class UploadImageDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openEditDialog: false,
      openAddDialog: false,
      image: undefined,
      searchStr: ""
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEditSave = this.handleEditSave.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchKeywords());
  }

  render() {
    const {
      openUploadImgDialog,
      isUploading,
      images,
      isLoading,
      keywords
    } = this.props.imagesReducer;

    const crudItems = this.getCrudItemsFromImages(images);
    const { classes } = this.props;
    return (
      <Dialog
        fullScreen
        open={openUploadImgDialog}
        onClose={this.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.handleClose}
              disabled={isUploading}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Change Image
            </Typography>
            <ReactFileReader
              handleFiles={files => this.handleImageUpload(files[0], keywords)}
              fileTypes={[".png", ".jpg", ".gif", ".jpeg", ".svg"]}
            >
              <Button color="inherit" disabled={isUploading}>
                Upload
              </Button>
            </ReactFileReader>
          </Toolbar>
        </AppBar>
        <div className="container">
          <SearchBar
            onChange={event => this.updateList(event)}
            searchStr={this.state.searchStr}
          />
          <CrudList
            items={crudItems}
            detail={IMAGES_DETAILS}
            isLoading={isLoading}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
            onLinkClick={this.handleLinkClick}
            hideBreadCrumb
            showUploadingCard={isUploading}
          />
          <KeywordsEditDialog
            open={this.state.openEditDialog}
            handleEditSave={this.handleEditSave}
            handleCancel={this.handleCancel}
            image={this.state.image}
          />
        </div>
      </Dialog>
    );
  }
  updateList = event => {
    const searchStr = event.target.value;
    this.setState({
      searchStr: searchStr
    });
    this.props.dispatch(fetchKeywords(searchStr));
  };

  handleEditSave(image) {
    this.props.dispatch(editImageKeywords(image));
    this.setState({
      openEditDialog: false,
      image: undefined
    });
  }
  handleCancel() {
    this.setState({
      openEditDialog: false,
      image: undefined
    });
  }

  handleDelete(image) {
    const { images } = this.props.imagesReducer;
    let index = 0;
    for (let i = 0; i < images.length; i++) {
      if (images[i].id === image.id) {
        index = i;
        break;
      }
    }
    this.props.dispatch(deleteImage(image, index));
  }

  handleEdit(image) {
    this.setState({
      openEditDialog: true,
      openAddDialog: false,
      image: image
    });
  }
  handleLinkClick = image => {
    this.props.dispatch(
      updateImageUrl(this.props.imagesReducer.refPath, image.icon)
    );
    this.props.dispatch(closeImageUploadDialog());
  };
  getCrudItemsFromImages = images => {
    if (images) {
      const items = [];
      for (let i = 0; i < images.length; i++) {
        let item = {};
        item.name = images[i].keywords;
        item.icon = images[i].url;
        item.id = images[i].id;
        item.object = images[i];
        items.push(item);
      }
      return items;
    }
  };

  handleClose = () => {
    this.props.dispatch(closeImageUploadDialog());
  };
  handleImageUpload = (img, keywords) => {
    this.props.dispatch(uploadImage(img, keywords));
  };
}

UploadImageDialog.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  dispatch: PropTypes.func,
  updateImageUrl: PropTypes.func
};

const mapStateToProps = state => {
  return {
    imagesReducer: state.ImagesReducer
  };
};

UploadImageDialog.propTypes = {
  imagesReducer: PropTypes.object
};

export default connect(mapStateToProps)(withStyles(styles)(UploadImageDialog));
