// @flow

import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const {dialog} = require('electron').remote;

import TreeView from 'react-treeview';

import PresentationItem from '../entities/presentationItem';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectFieldValue: '',
    };
  }

  componentDidMount() {
    console.log("app.js::componentDidMount invoked");
  }

  browseForFile() {
    let self = this;

    dialog.showOpenDialog({
      properties: ['openFile']
    }, (filePaths) => {
      console.log('selected file: ', filePaths[0]);
      self.filePath.input.value = filePaths[0];
    });
  }

  getRandom() {
    const r0 = Math.random();
    const r1 = Math.trunc(r0 * 100000);
    return r1;
  }

  openPresentation() {
    this.props.openPresentation(this.filePath.input.value);
  }

  getDivStyle() {
    return {
      width: '1000px',
    };
  }

  getInputFieldStyle(){
    return {
      height: '28px',
      width: '500px',
      fontSize: '12px',
      display: 'inline-block'
    };
  }

  getInputStyle(){
    return {
      padding: '0 2px 0 2px',
      top: '-5px',
      display: 'inline-block'
    };
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

  getCheckBoxStyle() {
    return {
      marginLeft: '2px'
    };
  }

  handleClick(propName, propValue) {
    console.log('handleClick invoked with parameters: ', propName, ' ', propValue);
  }

  buildSelectFieldMenuItem(index, text) {

    return (
      <MenuItem key={this.getRandom()} value={text} primaryText={text}/>
    );
  }

  buildSelectFieldMenuItems(values) {

    // this.setState({selectFieldValue : values[0]});

    const menuItems = values.map( (menuItemText, index) => {
      return this.buildSelectFieldMenuItem(index, menuItemText);
    });

    return menuItems;
  }


  handleSelectFieldChange(event, index, value) {
    console.log('event: ', event);
    console.log('index: ', index);
    console.log('value: ', value);
    this.setState({selectFieldValue : value});
  }

  renderPropValue(propValue) {

    const propName = propValue.propName;

    const keyLabel = <span className="info">{propName}</span>;

    const value = propValue.propValues[0];

    if (value instanceof PresentationItem) {
      if (value.itemDescriptor.uiElementType === 'textField') {
        return (
          <div key={this.getRandom()}>
            {keyLabel}
            <TextField
              id={this.getRandom().toString()}
              style={this.getTextEditInputFieldStyle()}
              inputStyle={this.getTextEditInputStyle()}
              defaultValue={value.value.toString()}
            />
          </div>
        );
      }
      else if (value.itemDescriptor.uiElementType === 'checkBox') {
        // labelPosition="left"
        return (
          <div key={this.getRandom()}>
            <Checkbox
              id={this.getRandom().toString()}
              style={this.getCheckBoxStyle()}
              label={keyLabel}
              defaultChecked={value.value}
            />
          </div>
        );
      }
      else if (value.itemDescriptor.uiElementType === 'selectField') {
        console.log(this.props.presentation);
        const selectFieldMenuItems = this.buildSelectFieldMenuItems(value.itemDescriptor.dropDownValues);
        return (
          <SelectField
            floatingLabelText={keyLabel}
            value={this.props.presentation.autoplay.BrightAuthor.meta.model.value}
            onChange={this.handleSelectFieldChange.bind(this)}
            key={this.getRandom()}
          >
            {selectFieldMenuItems}
          </SelectField>
        );
      }
    }
    else if (typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean') {
      const valueLabel = <span className="info">{value.toString()}</span>;
      return (
        <div key={this.getRandom()} onClick={this.handleClick.bind(this, propName, value)}>
          {keyLabel}: {valueLabel}
        </div>
      );
    }
    else if (typeof(value) === 'object' && (value instanceof Array) && (value.length === 0)) {
      return (
        <div key={this.getRandom()}>{keyLabel}: {'empty'}</div>
      );
    }
    else if (value === null) {
      return (
        <div key={this.getRandom()}>{keyLabel}: {'null'}</div>
      );
    }
    else {
      return this.getEmbeddedJsx(value);
    }
  }

  getTreeViewItem(treeViewLabel, allPropValues) {
    return (
      <TreeView key={this.getRandom()} nodeLabel={treeViewLabel} defaultCollapsed={false}>
        {allPropValues.map( (propValue) => {
          return this.renderPropValue(propValue);
        })}
      </TreeView>
    );
  }

  getEmbeddedJsx(embeddedTreeNode) {

    const propName = embeddedTreeNode.propName;
    const treeViewLabel = <span className="node">{propName}</span>;

    return (
      this.getTreeViewItem(treeViewLabel, embeddedTreeNode.propValues)
    );
  }

  getTreeView(treeNodes) {
    return (
      <div>
        {treeNodes.map( (treeNode) => {

          console.log('allPropValues: ', treeNode.propValues);
          console.log('propName: ', treeNode.propName);

          const allPropValues = treeNode.propValues;
          const label = <span className="node">{treeNode.propName}</span>;

          return (
            this.getTreeViewItem(label, allPropValues)
          );
        })}
      </div>
    );
  }

  buildTreeView(tree) {

    const treeView = this.getTreeView(tree);

    return (
      <div key={this.getRandom()}>
        {treeView}
      </div>
    );
  }


  buildTree(nodeName, nodeIn) {

    // console.log('nodeIn: ', nodeIn);

    let node = {};
    node.propName = nodeName;
    node.propValues = [];

    for (let key in nodeIn) {
      if (nodeIn.hasOwnProperty(key)) {
        let value = nodeIn[key];

        let nodeOut = {};
        nodeOut.propName = key;

        if ((!(value instanceof PresentationItem))
          && value !== null && typeof(value) === 'object'
          && Object.keys(value).length > 0) {
          value = this.buildTree(key, value);
          nodeOut.propValues = [value];
        }
        nodeOut.propValues = [value];
        node.propValues.push(nodeOut);
      }
    }

    // console.log('node: ', node);
    return node;
  }


  renderPresentation() {
    if (this.props.presentation.autoplay.BrightAuthor) {

      const treeViewTree = [this.buildTree('Presentation', this.props.presentation.autoplay.BrightAuthor)];
      return this.buildTreeView(treeViewTree);
    }
    return (
      null
    );
  }

  render() {

    let self = this;

    return (
      <MuiThemeProvider>
        <div style={this.getDivStyle()}>
          <p>Select Presentation</p>
          <TextField
            id='filePath'
            ref={(c) => {
              this.filePath = c;
            }}
            style={this.getInputFieldStyle()}
            inputStyle={this.getInputStyle()}
          />
          <FlatButton
            disableTouchRipple={true}
            label='Browse'
            onTouchTap={self.browseForFile.bind(self)}
          />
          <RaisedButton
            label='Open Presentation'
            onTouchTap={self.openPresentation.bind(this)}
          />
          <br/>
          {this.renderPresentation()}
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  openPresentation: React.PropTypes.func.isRequired,
  presentation: React.PropTypes.object.isRequired
};

