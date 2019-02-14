import React from "react";
import { newContextComponents } from "drizzle-react-components";
import { DrizzleContext } from "drizzle-react";
import logo from "../logo.png";

const { AccountData } = newContextComponents;

export default ({ accounts }) => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
      if (!initialized) {
        return "Loading...";
      }

      return (
        <div className="App">
          <div>
            <img src={logo} alt="drizzle-logo" />
            <h1>Drizzle Examples</h1>
            <p>Examples of how to get started with Drizzle in various situations.</p>
          </div>

          <div className="section">
            <h2>Active Account</h2>
            <AccountData drizzle={drizzle} drizzleState={drizzleState} accountIndex="0" units="ether" precision="3" />
          </div>
        </div >
      );
    }}
  </DrizzleContext.Consumer>
);