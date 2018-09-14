import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContractDataTableRow from './ContractDataTableRow.js';

/*
 * Create component.
 */

class ContractDataTable extends Component {
	constructor(props, context) {
		super(props);

		this.contracts = context.drizzle.contracts;
		this.web3 = context.drizzle.web3;
		
		this.columns = this.props.columns ? this.props.columns : [];
		this.ignore = this.props.ignore ? this.props.ignore : [];
		this.methodArgs = this.props.methodArgs ? this.props.methodArgs : [];

		this.scroll = this.props.scroll ? 'auto' : null;
		this.maxHeight = this.props.maxHeight ? this.props.maxHeight : null;

		this.dataKey = this.props.methods.length >= 1 ? this.contracts[this.props.contract].methods[this.props.methods[0]].cacheCall(...this.methodArgs) : null;
		
		this.state = {
			filterStr: '',
		}
	}

	render() {
		if (this.props.methods.length !== 2) {
			return (
				<span>Error: props.methods.length != 2</span>
			);
		}
		
		if (!this.props.contracts[this.props.contract].initialized) {
			return (
				<span>Initializing...</span>
			);
		}
		
		if (!(this.dataKey in this.props.contracts[this.props.contract][this.props.methods[0]])) {
			return (
				<span>Fetching...</span>
			);
		}
   
		/*
		 * Removed the indicator as it is unuseful in this context.
		 *
		 * // Show a loading spinner for future updates.
		 * var pendingSpinner = this.props.contracts[this.props.contract].synced ? '' : ' 🔄';
   		 * 
		 * // Optionally hide loading spinner (EX: ERC20 token symbol).
		 * if (this.props.hideIndicator) {
		 * 	pendingSpinner = '';
		 * }
		*/

		var data = this.props.contracts[this.props.contract][this.props.methods[0]][this.dataKey].value;

		return (
			<div style={{'maxHeight': this.maxHeight}}>
				{ this.props.searchbar ? this.renderSearchbar(this.props.placeholder) : null }
				<div style={{'overflow': this.scroll, 'maxHeight': this.maxHeight}}>
					<table>
						<thead>{ this.renderTableHeader(this.columns) }</thead>
						<tbody>{ this.renderTableBody(data) }</tbody>
					</table>
				</div>
			</div>
		);
	}

	renderTableHeader(data) {
		return (
			<tr>{data.map((datum, i) => (<th key={i}>{datum}</th>))}</tr>
		);
	}

	renderTableBody(data) {
		return data.map((datum, i) => (
			<ContractDataTableRow key={i}
				contract = {this.props.contract}
				method = {this.props.methods[1]}
				methodArgs = {[datum]}
				ignore = {this.ignore}
				numColumns = {this.columns.length}
				filterStr = {this.state.filterStr}
				toAscii = {this.props.toAscii}
				toUtf8 = {this.props.toUtf8}
			/>
		));
	}

	renderSearchbar(placeholder) {
		return !this.props.searchbar ? null : (
			<input
				type='text'
				placeholder={placeholder ? placeholder : 'Filter...'}
				style={{width: '75%'}}
				value={this.state.filterStr}
				onChange={(e) => this.setState({filterStr: e.target.value})}
			/>
		);
	}
}

ContractDataTable.contextTypes = {
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

export default drizzleConnect(ContractDataTable, mapStateToProps);
