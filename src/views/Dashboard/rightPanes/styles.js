const drawerWidth = 360;

const styles = theme => ({
  loadingImg: {
    display: "block",
    margin: "80px auto 0 auto"
  },
  loadingTxt: {
    textAlign: "center"
  },
  placeholderContainer: {
    height: "50vh",
    color: "#aaa",
    display: "block",
    width: "100%"
  },
  closeBtn: {
    position: "absolute",
    top: "5px",
    right: "20px",
    width: "35px",
    height: "35px",
    padding: 0
  },
  editBtn: {
    position: "absolute",
    top: "40px",
    right: "20px",
    width: "35px",
    height: "35px",
    padding: 0
  },
  divider: {
    margin: "10px"
  },
  card: {
    cursor: "pointer",
    marginBottom: "15px"
  },
  cardImg: {
    borderRadius: "4px !important",
    height: "120px",
    width: "120px",
    display: "block",
    margin: "15px auto 15px auto"
  },
  expansionPanelDetails: {
    margin: "0px",
    padding: "0px"
  },

  listRoot: {
    width: "100%",
    maxWidth: drawerWidth
  },

  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },

  appFrame: {
    height: "100hv",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },

  "content-left": {
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  }
});

export default styles;
