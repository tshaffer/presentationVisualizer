// @flow

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class App extends Component {

  componentDidMount() {
    console.log("app.js::componentDidMount invoked");
  }

  render() {

    console.log("app.js::render invoked");

    return (
      <MuiThemeProvider>
        <div>
          <p className="autorunText">Pizza</p>
          <p className="autorunText">Line 2</p>
          <p className="autorunText">Line 3</p>
        </div>
      </MuiThemeProvider>
    );
  }
}
