import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { drizzleReactHooks } from "drizzle-react";

function ContractForm(props) {
  // Setup variables & contract
  const { contract: contractName, method } = props;
  const { drizzle, useCacheSend } = drizzleReactHooks.useDrizzle();
  const contract = drizzle.contracts[contractName];

  // Get contract method's inputs from abi
  const abiInputs = {};
  const abiMethod = contract.abi.find(c => c.name === method);
  abiMethod.inputs.forEach(input => {
    abiInputs[input.name] = { type: input.type, value: "" };
  });

  // Setup inputs and senders
  const [inputs, setInputs] = useState(abiInputs);
  const cacheSender = useCacheSend(contractName, method);
  const memoizedSendCallBack = useCallback(
    values => {
      cacheSender.send(...values);
    },
    [cacheSender],
  );

  // Functions
  const translateType = type => {
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
  };
  const handleSubmit = e => {
    e.preventDefault();
    const convertedInputValues = Object.keys(inputs).map(key => {
      if (inputs[key].type === "bytes32") {
        return drizzle.web3.utils.toHex(inputs[key].value);
      }
      return inputs[key].value;
    });
    memoizedSendCallBack(convertedInputValues);
  };

  const handleChange = e => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setInputs({
      ...inputs,
      [e.target.name]: { ...inputs[e.target.name], value: value },
    });
  };

  // Custom render
  if (props.render) {
    return props.render({
      inputs,
      handleSubmit,
      handleChange,
    });
  }

  // Default render
  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(inputs).map((key, index) => {
        var inputType = translateType(inputs[key].type);
        var inputLabel = props.labels ? props.labels[index] : key;
        return (
          <input
            key={key}
            type={inputType}
            name={key}
            value={inputs[key].value}
            placeholder={inputLabel}
            onChange={handleChange}
          />
        );
      })}
      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
}

ContractForm.propTypes = {
  contract: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
  render: PropTypes.func,
};

export default ContractForm;
