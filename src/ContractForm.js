import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
 * Create component.
 */

class ContractForm extends Component {
  constructor(props, context) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.contracts = context.drizzle.contracts;

    // Get the contract ABI
    const abi = this.contracts[this.props.contract].abi;

    this.inputs = [];
    var initialState = {};

    // Iterate over abi for correct function.
    for (var i = 0; i < abi.length; i++) {
        if (abi[i].name === this.props.method) {
            this.inputs = abi[i].inputs;

            for (var i = 0; i < this.inputs.length; i++) {
                initialState[this.inputs[i].name] = this.getFixedValue(i) || '';
            }

            break;
        }
    }

    this.state = initialState;
  }

  handleSubmit() {
    this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(this.state));
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  translateType(type) {
    switch(true) {
        case /^uint/.test(type):
            return 'number'
            break
        case /^string/.test(type) || /^bytes/.test(type):
            return 'text'
            break
        case /^bool/.test(type):
            return 'checkbox'
            break
        default:
            return 'text'
    }
  }

  getType(index, type) { 
    if(Array.isArray(this.props.inputTypes) && this.props.inputTypes[index]) {
      return this.props.inputTypes[index];
    } else {
      return this.translateType(type);
    }
  }

  getFixedValue(index) {
    return Array.isArray(this.props.inputTypes) && this.props.fixedValue[index];
  }

  getInput(inputType, inputName, inputLabel) {
    switch(inputType) {
      case 'textarea':
        return (<textarea key={inputName} name={inputName} value={this.state[inputName]} placeholder={inputLabel} onChange={this.handleInputChange} />);
        break;
      default:
        return (<input key={inputName} type={inputType} name={inputName} value={this.state[inputName]} placeholder={inputLabel} onChange={this.handleInputChange} />)
    }
  }

  render() {
    return (
      <form className="pure-form pure-form-stacked">
        {this.inputs
          .filter((_, index) => !this.getFixedValue(index))
          .map((input, index) => {            
            var inputType = this.getType(index, input.type)
            var inputLabel = this.props.labels ? this.props.labels[index] : input.name;
            return this.getInput(inputType, input.name, inputLabel);  
        })}
        <button key="submit" className="pure-button" type="button" onClick={this.handleSubmit}>Submit</button>
      </form>
    )
  }
}

ContractForm.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    contracts: state.contracts
  }
}

export default drizzleConnect(ContractForm, mapStateToProps)
