import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Checkbox from 'material-ui/Checkbox';

export default class BooleanInput extends Component {

  getRandom() {
    const r0 = Math.random();
    const r1 = Math.trunc(r0 * 100000);
    return r1;
  }

  getCheckBoxStyle() {
    return {
      marginLeft: '2px'
    };
  }

  handleCheckboxChange(propKeys : Array<string>, _ : Object, isInputChecked : boolean) {

    let prop = this.props.presentation.autoplay.BrightAuthor;
    for (let i = 0; i < propKeys.length - 1; i++) {
      prop = prop[propKeys[i]];
    }
    this.props.setPresentationItemValue(prop[propKeys[propKeys.length - 1]], isInputChecked);
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
          <Checkbox
            key={this.getRandom()}
            style={this.getCheckBoxStyle()}
            label={keyLabel}
            checked={propValue}
            onCheck={this.handleCheckboxChange.bind(this, value.propKeys)}
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


