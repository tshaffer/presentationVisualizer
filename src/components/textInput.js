import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';

export default class BooleanInput extends Component {

  getRandom() {
    const r0 = Math.random();
    const r1 = Math.trunc(r0 * 100000);
    return r1;
  }

  getTextEditInputFieldStyle() {
    return {
      marginLeft: '8px',
      height: '28px',
      width: '200px',
      fontSize: '12px',
      display: 'inline-block'
    };
  }

  getTextEditInputStyle() {
    return {
      display: 'inline-block'
    };
  }

  handleTextFieldChange(propKeys : Array<string>, _ : Object, newValue : string) {

    let prop = this.props.presentation.autoplay.BrightAuthor;
    for (let i = 0; i < propKeys.length - 1; i++) {
      prop = prop[propKeys[i]];
    }
    this.props.setPresentationItemValue(prop[propKeys[propKeys.length - 1]], newValue);
  }

  getPropValue(propKeys : Array<string>) {
    let propValue = this.props.presentation.autoplay.BrightAuthor;
    propKeys.forEach( (propKey) => {
      propValue = propValue[propKey];
    });

    return propValue['value'];
  }

  render() {

    const propName = this.props.propValue.propName;
    const keyLabel = <span className="info">{propName}</span>;
    const value = this.props.propValue.propValues[0];
    const propValue = this.getPropValue(value.propKeys);

    return (
      <MuiThemeProvider>
        <div key={this.getRandom()}>
          {keyLabel}
          <TextField
            id={this.getRandom().toString()}
            style={this.getTextEditInputFieldStyle()}
            inputStyle={this.getTextEditInputStyle()}
            value={propValue}
            onChange={this.handleTextFieldChange.bind(this, value.propKeys)}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

BooleanInput.propTypes = {
  presentation: React.PropTypes.object.isRequired,
  setPresentationItemValue: React.PropTypes.func.isRequired,
  propValue: React.PropTypes.object.isRequired
};


