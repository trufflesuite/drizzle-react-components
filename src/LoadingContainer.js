import React, { Children, Component, cloneElement } from "react";
import { DrizzleContext } from "drizzle-react";
import PropTypes from "prop-types";

class GeneralInfoFragment extends Component {
  render() {
    const { icon, children } = this.props;
    return (
      <main className="container loading-screen">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>{icon}</h1>
            <p>{children}</p>
          </div>
        </div>
      </main>
    );
  }
}

GeneralInfoFragment.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

const loadingInfoFragment = () => (
  <GeneralInfoFragment icon="⚙️">
    Loading blockchain info...
  </GeneralInfoFragment>
);

const loadingFailedFragment = () => (
  <GeneralInfoFragment icon="⚠️️️">
    This browser has no connection to the Ethereum network. Please use the
    Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or
    Parity.
  </GeneralInfoFragment>
);

const accountProblemFragment = () => (
  <GeneralInfoFragment icon="🦊">
    <strong>We can't find any Ethereum accounts!</strong> Please check and make
    sure Metamask or your browser are pointed at the correct network and your
    account is unlocked.
  </GeneralInfoFragment>
);

class LoadingContainer extends Component {
  render() {
    const { children, loadingComp, errorComp } = this.props;
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (drizzle.web3.status === "failed")
            return errorComp ? errorComp : loadingFailedFragment();
          if (!initialized)
            return loadingComp ? loadingComp : loadingInfoFragment();
          if (drizzleState.accounts.length === 0)
            return accountProblemFragment();

          return Children.map(children, child =>
            cloneElement(child, {
              drizzle: drizzle,
              drizzleState: drizzleState
            })
          );
        }}
      </DrizzleContext.Consumer>
    );
  }
}
LoadingContainer.propTypes = {
  children: PropTypes.object,
  loadingComp: PropTypes.object,
  errorComp: PropTypes.object
};

export default LoadingContainer;
