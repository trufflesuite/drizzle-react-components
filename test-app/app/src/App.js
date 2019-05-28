import React, { Component } from "react";
import { Drizzle } from "drizzle";
import { DrizzleContext } from "drizzle-react";
import { newContextComponents } from "drizzle-react-components";

import "./App.css";

import drizzleOptions from "./drizzleOptions";
import MyComponent from "./MyComponent";

const drizzle = new Drizzle(drizzleOptions);
const { LoadingContainer } = newContextComponents;

class App extends Component {
  render() {
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzleState } = drizzleContext;
            return (
              <LoadingContainer drizzle={drizzle} drizzleState={drizzleState}>
                <MyComponent />
              </LoadingContainer>
            );
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    );
  }
}

export default App;
