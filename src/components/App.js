// @flow

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class App extends Component {

  componentDidMount() {
    console.log("app.js::componentDidMount invoked");
  }

  render() {

    return (
      <MuiThemeProvider>
        <p>Pizza</p>
      </MuiThemeProvider>
    );
  }
}
