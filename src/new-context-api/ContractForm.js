import React, { Component } from "react";
import PropTypes from "prop-types";

class ContractForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.sendArgs = props.sendArgs || {};

    this.contracts = props.drizzle.contracts;
    this.utils = props.drizzle.web3.utils;

    // Get the contract ABI
    const abi = this.contracts[this.props.contract].abi;

    this.inputs = [];

    // Iterate over abi for correct function.
    for (var i = 0; i < abi.length; i++) {
      if (abi[i].name === this.props.method) {
        this.inputs = abi[i].inputs;

        // create references for all values, to be used in the form elements
        for (var j = 0; j < this.inputs.length; j++) {
          this.inputs[j].ref = React.createRef();
        }

        break;
      }
    }
  }

  setSendArgs(args) {
    Object.assign(this.sendArgs, args);
  }

  handleSubmit(event) {
    event.preventDefault();

    const convertedInputs = this.inputs.map(input => {
      var value = input.ref.current !== null ? input.ref.current.value : ""; // default for undefined values
      if (input.type === "bytes32") {
        return this.utils.toHex(value);
      }
      return value;
    });

    if (this.sendArgs) {
      return this.contracts[this.props.contract].methods[
        this.props.method
      ].cacheSend(...convertedInputs, this.sendArgs);
    }

    return this.contracts[this.props.contract].methods[
      this.props.method
    ].cacheSend(...convertedInputs);
  }

  translateType(type) {
    switch (true) {
      case /^uint/.test(type):
        return "number";
      case /^string/.test(type) || /^bytes/.test(type):
        return "text";
      case /^bool/.test(type):
        return "checkbox";
      default:
        return "text";
    }
  }

  render() {
    // If a render prop is given, have displayData rendered from that component
    if (this.props.render) {
      // calls render with array of input names and event handler
      return this.props.render(
        this.inputs.reduce((map, input) => {
          map[input.name] = input.ref;
          return map;
        }, {}),
        this,
      );
    }
    return (
      <form
        className="pure-form pure-form-stacked"
        onSubmit={this.handleSubmit}
      >
        {this.inputs.map((input, index) => {
          var inputType = this.translateType(input.type);
          var inputLabel = this.props.labels
            ? this.props.labels[index]
            : input.name;
          // check if input type is struct and if so loop out struct fields as well
          return (
            <input
              key={input.name}
              type={inputType}
              name={input.name}
              ref={input.ref}
              placeholder={inputLabel}
            />
          );
        })}
        <button
          key="submit"
          className="pure-button"
          type="button"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </form>
    );
  }
}

ContractForm.propTypes = {
  drizzle: PropTypes.object.isRequired,
  contract: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  sendArgs: PropTypes.object,
  labels: PropTypes.arrayOf(PropTypes.string),
  render: PropTypes.func,
};

export default ContractForm;
