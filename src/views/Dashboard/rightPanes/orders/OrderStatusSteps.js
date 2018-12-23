import React from "react";
import PropTypes from "prop-types";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

function getSteps() {
  return [
    "Order placed",
    "Food is being prepaired",
    "Ready to serve",
    "Food served",
    "Dining",
    "Bill paid"
  ];
}

class VerticalLinearStepper extends React.Component {
  state = {
    activeStep: 0
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  render() {
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className="">
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <div className="">
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className=""
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                        className=""
                      >
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className="">
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={this.handleReset} className="">
              Reset
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

// function getStepContent(stepIndex) {
//   switch (stepIndex) {
//     case 0:
//       return "Order placed";
//     case 1:
//       return "Food is being prepaired";
//     case 2:
//       return "Ready to serve";
//     case 3:
//       return "Food served";
//     case 4:
//       return "Happy dining";
//     case 5:
//       return "Bill paid";
//     default:
//       return "Status Unknown";
//   }
// }

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object
};

export default VerticalLinearStepper;
