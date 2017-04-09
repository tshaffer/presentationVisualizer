import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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

  handleSelectFieldChange(propKeys : Array<string>, _ : Object, __ : Object, selectedMenuItemValue : string) {

    let prop = this.props.presentation.autoplay.BrightAuthor;
    for (let i = 0; i < propKeys.length - 1; i++) {
      prop = prop[propKeys[i]];
    }
    prop[propKeys[propKeys.length - 1]].value = selectedMenuItemValue;

    this.forceUpdate();
  }

  buildSelectFieldMenuItem(index : number, text : string) {

    return (
      <MenuItem key={this.getRandom()} value={index} primaryText={text}/>
    );
  }

  buildSelectFieldMenuItems(values : Array<string>) {

    const menuItems = values.map( (menuItemText, index) => {
      return this.buildSelectFieldMenuItem(index, menuItemText);
    });

    return menuItems;
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
    const selectFieldMenuItems = this.buildSelectFieldMenuItems(value.itemDescriptor.dropDownValues);
    const propValue = this.getPropValue(value.propKeys);

    return (
      <MuiThemeProvider>
        <div>
          <SelectField
            floatingLabelText={keyLabel}
            value={propValue}
            onChange={this.handleSelectFieldChange.bind(this, value.propKeys)}
            key={this.getRandom()}
          >
            {selectFieldMenuItems}
          </SelectField>
        </div>
      </MuiThemeProvider>
    );
  }
}

BooleanInput.propTypes = {
  presentation: React.PropTypes.object.isRequired,
  propValue: React.PropTypes.object.isRequired
};


