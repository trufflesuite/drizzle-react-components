# drizzle-react-components
A set of useful components for common UI elements.

## Components

### LoadingContainer

This component wraps your entire app (but within the DrizzleProvider) and will show a loading screen until Drizzle, and therefore web3 and your contracts, are initialized.

`loadingComp` (component) The component displayed while Drizzle initializes.

`errorComp` (component) The component displayed if Drizzle initialization fails.

### ContractData

`contract` (string, required) Name of the contract to call.

`method` (string, required) Method of the contract to call.

`methodArgs` (array) Arguments for the contract method call. EX: The address for an ERC20 balanceOf() function. The last argument can optionally be an options object with the typical form, `gas` and `gasPrice` keys.

`hideIndicator` (boolean) If true, hides the loading indicator during contract state updates. Useful for things like ERC20 token symbols which do not change.

`toUtf8` (boolean) Converts the return value to a UTF-8 string before display.

`toAscii` (boolean) Converts the return value to an Ascii string before display.

### ContractDataTable

`contract` (string, required) Name of the contract to call.

`methods` (string array, required) Method of the contract to call; the first method should retrieve a list of keys and the second method should retrieve an object given its key. EX: `methods = ['getObjectKeys', 'getObject']`.  

`methodArgs` (array) Arguments for the contract method call. EX: The address for an ERC20 balanceOf() function. The last argument can optionally be an options object with the typical form, `gas` and `gasPrice` keys.

`ignore` (array) Indices to ignore in the data. EX: If `getObject(id)` returns 8 fields (indexed 0 to 7), then `ignore = [0,1,2,7]` will remove the corresponding fields from the table row so only 4 fields (i.e. with indices 3,4,5,6) are visible.

`columns` (array) Names for table columns.

`searchbar` (boolean) If true, adds a searchbar to filter the table. EX: 'a;b,c;d,e,f' will filter for results that in include 'a' and ('b' or 'c') and ('d' or 'e' or 'f').

`toUtf8` (boolean or array) Converts the return value to a UTF-8 string before display.

`toAscii` (boolean or array) Converts the return value to an Ascii string before display.

`maxHeight` (string) If `scroll` is true, sets a maximum height for the table.

`scroll` (boolean) If true and `maxHeight` is specified, enables scrolling within the table when it exceeds `maxHeight`.

### ContractDataTableRow

`contract` (string, required) Name of the contract to call.

`method` (string, required) Method of the contract to call; the method should retrieve an object given its key. EX: 'getObject'.  

`methodArgs` (array) Arguments for the contract method call. EX: The address for an ERC20 balanceOf() function. The last argument can optionally be an options object with the typical form, `gas` and `gasPrice` keys.

`ignore` (array) Indices to ignore in the data. EX: If the specified method returns 8 fields (indexed 0 to 7), then `ignore = [0,1,2,7]` will remove the corresponding fields from the table row so only 4 fields (i.e. with indices 3,4,5,6) are visible.

`filterStr` (string) A string against which the contents of the row are checked; a row is only displayed if all conditions are met. EX: 'a;b,c;d,e,f' will filter for results that in include 'a' and ('b' or 'c') and ('d' or 'e' or 'f').

`toUtf8` (boolean or array) Converts the return value to a UTF-8 string before display.

`toAscii` (boolean or array) Converts the return value to an Ascii string before display.

`numColumns` (array) Expected number of columns; used to set width of cell when data is being fetched.

### ContractForm

`contract` (string, required) Name of the contract whose method will be the basis the form.

`method` (string, required) Method whose inputs will be used to create corresponding form fields.

`sendArgs` (object) An object specifying options for the transaction to be sent; namely: `from`, `gasPrice`, `gas` and `value`. Further explanataion of these parameters can be found [here in the web3 documentation](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#id19).

`labels` (array) Custom labels; will follow ABI input ordering. Useful for friendlier names. For example "_to" becoming "Recipient Address".
