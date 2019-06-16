import React from "react";
import PropTypes from "prop-types";
import { drizzleReactHooks } from "drizzle-react";

function AccountData(props) {
  const precisionRound = (number, precision) => {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  };

  const drizzleState = drizzleReactHooks.useDrizzleState(drizzleState => ({
    accounts: drizzleState.accounts,
    accountBalances: drizzleState.accountBalances,
  }));

  const { drizzle } = drizzleReactHooks.useDrizzle();

  // No accounts found
  if (Object.keys(drizzleState.accounts).length === 0) {
    return <span>Initializing...</span>;
  }

  // Get account address and balance
  const address = drizzleState.accounts[props.accountIndex];
  var balance = drizzleState.accountBalances[address];
  const units = props.units
    ? props.units.charAt(0).toUpperCase() + props.units.slice(1)
    : "Wei";

  // Convert to given units
  if (props.units && typeof balance !== "undefined") {
    balance = drizzle.web3.utils.fromWei(balance, props.units);
  }

  // Adjust to given precision
  if (props.precision) {
    balance = precisionRound(balance, props.precision);
  }

  // Custom render
  if (props.render) {
    return props.render({
      address,
      balance,
      units,
    });
  }

  // Default render
  return (
    <div>
      <h4>{address}</h4>
      <p>
        {balance} {units}
      </p>
    </div>
  );
}

AccountData.propTypes = {
  accountIndex: PropTypes.number.isRequired,
  units: PropTypes.string,
  precision: PropTypes.number,
  render: PropTypes.func,
};

export default AccountData;
