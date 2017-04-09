// @flow

import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import BooleanInputContainer from '../containers/booleanInputContainer';
import TextInputContainer from '../containers/textInputContainer';
import ListInputContainer from '../containers/listInputContainer';

const {dialog} = require('electron').remote;

import TreeView from 'react-treeview';

import PresentationItem from '../entities/presentationItem';

export default class App extends Component {

  componentDidMount() {
    console.log("app.js::componentDidMount invoked");
  }

  filePath : Object;

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

  savePresentation() {
    this.props.savePresentation(this.filePath.input.value);
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

  renderPropValue(propValue : Object) {

    const propName = propValue.propName;
    const keyLabel = <span className="info">{propName}</span>;
    const value = propValue.propValues[0];

    if (value instanceof PresentationItem) {
      if (value.itemDescriptor.uiElementType === 'textField') {
        return (
          <TextInputContainer
            propValue={propValue}
          />
        );
      }
      else if (value.itemDescriptor.uiElementType === 'checkBox') {
        return (
          <BooleanInputContainer
            propValue={propValue}
          />
        );
      }
      else if (value.itemDescriptor.uiElementType === 'selectField') {

        return (
          <ListInputContainer
            propValue={propValue}
          />
        );
      }
    }
    else if (typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean') {
      const valueLabel = <span className="info">{value.toString()}</span>;
      return (
        <div key={this.getRandom()}>
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

  getTreeViewItem(treeViewLabel, allPropValues : Array<Object>) {
    return (
      <TreeView key={this.getRandom()} nodeLabel={treeViewLabel} defaultCollapsed={false}>
        {allPropValues.map( (propValue) => {
          return this.renderPropValue(propValue);
        })}
      </TreeView>
    );
  }

  getEmbeddedJsx(embeddedTreeNode : Object) {

    const propName = embeddedTreeNode.propName;
    const treeViewLabel = <span className="node">{propName}</span>;

    return (
      this.getTreeViewItem(treeViewLabel, embeddedTreeNode.propValues)
    );
  }

  getTreeView(treeNodes : Array<Object>) {
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

  buildTreeView(tree : Array<Object>) {

    const treeView = this.getTreeView(tree);

    return (
      <div key={this.getRandom()}>
        {treeView}
      </div>
    );
  }


  buildTree(nodeName : string, nodeIn : Object) {

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
          <RaisedButton
            label='Save Presentation'
            onTouchTap={self.savePresentation.bind(this)}
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
  savePresentation: React.PropTypes.func.isRequired,
  presentation: React.PropTypes.object.isRequired
};

