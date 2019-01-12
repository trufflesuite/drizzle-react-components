import React, { Component } from 'react';

/*
 * Create component.
 */

class ContractData extends Component {
    constructor(props) {
        super(props);

        this.method = this.props.drizzle.contracts[this.props.contract].methods[this.props.method];
        var methodArgs = this.props.methodArgs ? this.props.methodArgs : [];
        this.state = { dataKey: this.method.cacheCall(...methodArgs) };
    }

    /**
    * componentDidUpdate is the right choice for updating the component anytime the
    * methodArgs change throughout ContractData's lifecycle
    */
    componentDidUpdate(prevProps) {
        /** 
        * Check if methodArgs is defined, if it's not, the stringified empty arrays will always 
        * be exactly equal and componentDidUpdate will always execute the nested code causing
        * the app to throw: "Uncaught RangeError: Maximum call stack size exceeded"
        */
        if (this.props.methodArgs) {
            /**
             * In this case is correct to use JSON.stringify instead of .toString() 
             * https://stackoverflow.com/questions/15834172/whats-the-difference-in-using-tostring-compared-to-json-stringify
             */
            if (JSON.stringify(this.props.methodArgs) !== JSON.stringify(prevProps.methodArgs)) {
                this.setState({
                    dataKey: this.method.cacheCall(...this.props.methodArgs)
                });
            }
        }
    }

	render() {
		const { drizzle, drizzleState } = this.props;

		// Contract is not yet intialized.
		if(!drizzleState.contracts[this.props.contract].initialized) {
			return (
				<span>Initializing...</span>
			);
		}
	
		// If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
		if(!(this.state.dataKey in drizzleState.contracts[this.props.contract][this.props.method])) {
			return null;
		}

		// Show a loading spinner for future updates.
		var pendingSpinner = drizzleState.contracts[this.props.contract].synced ? '' : ' 🔄';
		
		// Optionally hide loading spinner (EX: ERC20 token symbol).
		if (this.props.hideIndicator) {
			pendingSpinner = '';
		}

		var displayData = drizzleState.contracts[this.props.contract][this.props.method][this.state.dataKey].value;
		
		if (displayData instanceof Object) {
			displayData = Object.values(displayData);
		}

		if (this.props.displayFunc) {
			return this.props.displayFunc(displayData);
		}

		// Optionally convert to UTF8
		if (this.props.toUtf8) {
			displayData = drizzle.web3.utils.hexToUtf8(displayData);
		}
		
		// Optionally convert to Ascii
		if (this.props.toAscii) {
			displayData = drizzle.web3.utils.hexToAscii(displayData);
		}

		if (displayData instanceof Array) {
			const displayListItems = displayData.map((datum, i) => (
				<li key={i}>{datum}{pendingSpinner}</li>
			));
			return (
				<ul>{displayListItems}</ul>
			);
		}
      
		return (
			<span>{displayData}{pendingSpinner}</span>
		);
	}
}

export default ContractData;
