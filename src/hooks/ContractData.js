import React from "react";
import PropTypes from "prop-types";
import { drizzleReactHooks } from "drizzle-react";

function ContractData(props) {
  // Setup variables
  const { contract, method } = props;
  const methodArgs = props.methodArgs ? props.methodArgs : [];
  const drizzleState = drizzleReactHooks.useDrizzleState(drizzleState => ({
    contracts: drizzleState.contracts,
  }));
  const { drizzle, useCacheCall } = drizzleReactHooks.useDrizzle();

  // Fetch data
  var displayData = useCacheCall(contract, method, ...methodArgs);

  if (typeof displayData === "undefined" || displayData === null) {
    return <span>Fetching...</span>;
  }

  // Contract is not yet initialized
  if (!drizzleState.contracts[contract].initialized) {
    return <span>Initializing...</span>;
  }

  // Show a loading spinner for future updates
  var pendingSpinner = drizzleState.contracts[props.contract].synced
    ? ""
    : " 🔄";

  // Optionally hide loading spinner (EX: ERC20 token symbol)
  if (props.hideIndicator) {
    pendingSpinner = "";
  }

  // Optionally convert to UTF8
  if (props.toUtf8) {
    displayData = drizzle.web3.utils.hexToUtf8(displayData);
  }

  // Optionally convert to Ascii
  if (props.toAscii) {
    displayData = drizzle.web3.utils.hexToAscii(displayData);
  }

  // Custom render
  if (props.render) {
    return props.render(displayData);
  }

  // If return value is an array
  if (Array.isArray(displayData)) {
    const displayListItems = displayData.map((datum, index) => {
      return (
        <li key={index}>
          {`${datum}`}
          {pendingSpinner}
        </li>
      );
    });

    return <ul>{displayListItems}</ul>;
  }

  // If return value is an object
  if (typeof displayData === "object") {
    var i = 0;
    const displayObjectProps = [];

    Object.keys(displayData).forEach(key => {
      if (i !== key) {
        displayObjectProps.push(
          <li key={i}>
            <strong>{key}</strong>
            {pendingSpinner}
            <br />
            {`${displayData[key]}`}
          </li>,
        );
      }

      i++;
    });

    return <ul>{displayObjectProps}</ul>;
  }

  // Default render
  return (
    <span>
      {`${displayData}`}
      {pendingSpinner}
    </span>
  );
}

ContractData.propTypes = {
  contract: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  methodArgs: PropTypes.array,
  hideIndicator: PropTypes.bool,
  toUtf8: PropTypes.bool,
  toAscii: PropTypes.bool,
  render: PropTypes.func,
};

export default ContractData;
