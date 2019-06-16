import React, { Component } from "react";
import { Drizzle } from "drizzle";
import { drizzleReactHooks } from "drizzle-react";

import "./App.css";

import drizzleOptions from "./drizzleOptions";
import MyComponent from "./MyComponent";

const drizzle = new Drizzle(drizzleOptions);

class App extends Component {
  render() {
    return (
      <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
        <drizzleReactHooks.Initializer
          // Optional `node` to render on errors. Defaults to `'Error.'`.
          error="There was an error."
          // Optional `node` to render while loading contracts and accounts. Defaults to `'Loading contracts and accounts.'`.
          loadingContractsAndAccounts="Also still loading."
          // Optional `node` to render while loading `web3`. Defaults to `'Loading web3.'`.
          loadingWeb3="Still loading."
        >
          <MyComponent />
        </drizzleReactHooks.Initializer>
      </drizzleReactHooks.DrizzleProvider>
    );
  }
}

export default App;
