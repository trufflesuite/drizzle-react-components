# drizzle-react-components
A set of useful components for common UI elements compatible with React Context API v16.3+.

## Components

All components require a `drizzle` and `drizzleState` props. See the [drizzle-react](https://github.com/trufflesuite/drizzle-react) documentation to learn how to create and manage these objects within your application.

### AccountData

AccountData fetches the balance of an address.

`accountIndex` (string, required) Index of the account to get the balance of.

`units` (string) Units to convert balance into; the default is "Wei".

`displayFunc` (function(addr, bal, units)) If given, used to format and display the account data. 

### ContractData

ContractData fetches data from a contract using the specified method and renders the result(s) as an unordered list (i.e., inside `<ul>` tags) by default. The default behaviour can be overwritten by specifying a `displayFunc` as decribed below; this enables the composition of more complex structures, like tables (see examples).

`contract` (string, required) Name of the contract to call.

`method` (string, required) Method of the contract to call.

`methodArgs` (array) Arguments for the contract method call. EX: The address for an ERC20 balanceOf() function. The last argument can optionally be an options object with the typical form, `gas` and `gasPrice` keys.

`hideIndicator` (boolean) If true, hides the loading indicator during contract state updates. Useful for things like ERC20 token symbols that do not change.

`displayFunc` (function(data)) If given, used to format and display the contract data.

`toUtf8` (boolean) Converts the return value to a UTF-8 string before display.

`toAscii` (boolean) Converts the return value to an Ascii string before display.

### ContractForm

ContractForm creates a form for interacting with methods on smart contracts.

`contract` (string, required) Name of the contract whose method will be the basis the form.

`method` (string, required) Method whose inputs will be used to create corresponding form fields.

`sendArgs` (object) An object specifying options for the transaction to be sent; namely: `from`, `gasPrice`, `gas` and `value`. Further explanataion of these parameters can be found [here in the web3 documentation](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#id19).

`labels` (array) Custom labels; will follow ABI input ordering. Useful for friendlier names. EX: "to" becoming "Recipient Address".

`hideMethod` (boolean) Hides the method name if true.

## Example Usage

### AccountData

```<AccountData drizzle={drizzle} drizzleState={drizzleState} accountIndex='0' units='ether' displayFunc={(addr, bal, units) => (<div><strong>{addr}</strong>: {bal} {units}</div>)} />```

> **0x...**: 3.43 ether


### ContractData

```
<ContractData drizzle={drizzle} drizzleState={drizzleState} contract='MyContract' method='getStructKeys' />
```

produces:

<ul><li>structKey1</li><li>structKey2</li><li>...</li></ul>

```
<ContractData drizzle={drizzle} drizzleState={drizzleState} contract='MyContract' method='getStruct' methodArgs={['1']} />
```

produces:

<ul><li>struct1Field1</li><li>struct1Field2</li><li>...</li></ul>

```
<ContractData drizzle={drizzle} drizzleState={drizzleState} contract='MyContract' method='getStructKeys'
  displayFunc={data => data === undefined ? null : data.map((id, i) => (
    <ContractData key={i} drizzle={drizzle} drizzleState={drizzleState} contract='MyContract'
      method='getStruct'
      methodArgs={[id]}
      displayFunc={data_ => data_ === undefined ? null : (
        <tr>{data_.map((val, j) => (<td key={j}>{val}</td>)}</tr>
      )}
    />
  ))}
/>
```

produces:

<table><tr><td>struct1Field1</td><td>struct1Field2</td><td>...</td></tr> <tr><td>struct2Field1</td><td>struct2Field2</td><td>...</td></tr></table>


### ContractForm

`<ContractForm drizzle={drizzle} drizzleState={drizzleState} contract='MyContract' method='addStruct' />`
