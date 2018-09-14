import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
 * Create component.
 */

class ContractDataTableRow extends Component {
	constructor(props, context) {
		super(props);
		this.contracts = context.drizzle.contracts;
		this.web3 = context.drizzle.web3;
	
		// Sort indices to ignore into decreasing order.
		this.ignore = this.props.ignore ? this.props.ignore.sort((a, b) => a - b) : [];

		this.numColumns = this.props.numColumns !== undefined ? this.props.numColumns : 1;
		this.methodArgs = this.props.methodArgs ? this.props.methodArgs : [];

		// Fetch initial value from chain and return cache key for reactive updates.
		this.dataKey = this.contracts[this.props.contract].methods[this.props.method].cacheCall(...this.methodArgs);
	}

	render() {
		// Contract is not yet intialized.
		if (!this.props.contracts[this.props.contract].initialized) {
			return (
				<tr><td colspan={this.numColumns}><span>Initializing...</span></td></tr>
			);
		}

		// If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
		if (!(this.dataKey in this.props.contracts[this.props.contract][this.props.method])) {
			return (
				<tr><td colSpan={this.numColumns}><span>Fetching...</span></td></tr>
			);
		}

		var displayData = this.props.contracts[this.props.contract][this.props.method][this.dataKey].value;

		// Convert value into an array. 
		displayData = displayData instanceof Object ? Object.values(displayData) : [displayData];

		// Optionally delete ignored items by index.
		this.ignore.map(i => i >= 0 && i < displayData.length ? displayData.splice(i, 1) : null); 

		// Optionally convert to ASCII or UTF8; attempt in that order.
		if (this.props.toAscii instanceof Array) {
			if (this.props.toAscii.includes(true)) {
				displayData = displayData.map((datum, i) => this.toAsciiArr(datum, i));
			}
		} else if (this.props.toAscii) {
			displayData = displayData.map(datum => this.toAscii(datum));
		} else if (this.props.toUtf8 instanceof Array) {
			if (this.props.toUtf8.includes(true)) {
				displayData = displayData.map((datum, i) => this.toUtf8Arr(datum, i));
			}
		} else if (this.props.toUtf8) {
			displayData = displayData.map(datum => this.toUtf8(datum));
		}
	
		// Check whether the value satisfies the filter (i.e. filterStr); if not, set it to an empty array.
		displayData = this.props.filterStr.split(';').every(str => str.split(',').some(str => displayData.some(datum => datum.includes(str)))) ? displayData : [];

		return (
			<tr>{ displayData.map((datum, i) => (<td key={i}>{datum instanceof Object ? Object.values(datum).join(',') : datum}</td>)) }</tr>
		);
	}

	// Helper functions for conversions from hex to ASCII and UTF8.
	toEncoding(encoder, val) { return val instanceof Object ? Object.values(val).map(v => this.web3.utils.isHexStrict(v) ? encoder(v) : v) : (this.web3.utils.isHexStrict(val) ? encoder(val) : val); }
	toAscii(val) { return this.toEncoding(this.web3.utils.hexToAscii, val); }
	toUtf8(val) { return this.toEncoding(this.web3.utils.hexToUtf8, val); }
	toAsciiArr(val, i) { return this.props.toAscii[i] ? this.toAscii(val) : val; }
	toUtf8Arr(val, i) { return this.props.toUtf8[i] ? this.toUtf8(val) : val; }
}

ContractDataTableRow.contextTypes = {
	drizzle: PropTypes.object,
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
	}
}

export default drizzleConnect(ContractDataTableRow, mapStateToProps);
