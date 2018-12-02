import React, { Component } from 'react';

/*
 * Create component.
 */

class AccountData extends Component {
	constructor(props) {
		super(props);
		this.address = this.props.drizzleState.accounts[this.props.accountIndex];
		this.state = { balance: 0 };
	}

	componentDidMount() {
		const balance = this.props.drizzleState.accountBalances[this.address];
		this.setState({ balance });
	}

	render() {
		// Use lowercase units. See https://web3js.readthedocs.io/en/1.0/web3-utils.html#fromwei.
    const units = this.props.units ? this.props.units.toLowerCase() : 'wei'
    var balance = this.props.drizzle.web3.utils.fromWei(this.state.balance.toString(), units)

		if (this.props.precision) {
			// Should there be a sanity check on the precision prop before calling?
			// e.g. precision = this.props.precision >= 0 ? this.props.precision : 3
			balance = this.precisionRound(balance, this.props.precision)	
		}
		
		if (this.props.displayFunc) {
			return this.props.displayFunc(this.address, balance, units); 
		}

		return (
			<div>
				<h4>{this.address}</h4>
				<p>{balance} {units}</p>
			</div>
		);
	}
	
	precisionRound(number, precision) {
		var factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;
	}
}

export default AccountData;
