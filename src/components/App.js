// @flow

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const {dialog} = require('electron').remote;

import TreeView from 'react-treeview';

export default class App extends Component {

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

  getInputFieldStyle(){
    return {
      height: '28px',
      width: '500px',
      fontSize: '12px',
      display: 'inline-block'
    };
  }

  getDivStyle() {
    return {
      width: '1000px',
    };
  }

  getInputStyle(){
    return {
      padding: '0 2px 0 2px',
      top: '-5px',
      display: 'inline-block'
    };
  }

  renderPropValue(propValue) {

    const keyLabel = <span className="info">{propValue.key}</span>;

    const value = propValue.value;

    if (typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean') {
      const valueLabel = <span className="info">{value.toString()}</span>;
      return (
        <div key={this.getRandom()}>{keyLabel}: {valueLabel}</div>
      );
    }
    else if (typeof(value) === 'object' && (value instanceof Array) && (value.length === 0)) {
      return (
        <div key={this.getRandom()}>{keyLabel}: {'empty'}</div>
      );
    }
    else {
      let embeddedTreeNodes = [];
      embeddedTreeNodes.push( {
        propName: value.propName,
        propValues: value.propValues
      });

      return this.getEmbeddedJsx(embeddedTreeNodes);
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

  getEmbeddedJsx(embeddedTreeNodes) {

    const propName = embeddedTreeNodes[0].propName;
    const treeViewLabel = <span className="node">{propName}</span>;

    return (
      this.getTreeViewItem(treeViewLabel, embeddedTreeNodes[0].propValues)
    );
  }

  getTreeView(treeNodes) {
    return (
      <div>
        {treeNodes.map( (treeNode) => {
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
    return (
      <div key={this.getRandom()}>
        {this.getTreeView(tree)}
      </div>
    );
  }

  buildTree(nodeName, nodeIn) {

    let node = {};
    node.propName = nodeName;
    node.propValues = [];

    for (let key in nodeIn) {
      if (nodeIn.hasOwnProperty(key)) {
        let value = nodeIn[key];
        if (typeof(value) === 'object' && Object.keys(value).length > 0) {
          console.log('recurse buildTree with: ', key, ' ', value);
          const newNode = this.buildTree(key, value);
          node.propValues.push( {
            key,
            value: newNode
          });
        }
        else {
          node.propValues.push( {
            key,
            value
          });
        }
      }
    }

    return node;
  }

  recursePresentationNodes(nodeName, nodeIn) {

    let node = {};
    node.propName = nodeName;
    node.propValues = [];

    for (let key in nodeIn) {
      if (nodeIn.hasOwnProperty(key)) {
        let value = nodeIn[key];
        if (typeof(value) === 'object' && Object.keys(value).length > 0) {
          const newNode = this.recursePresentationNodes(key, value);
          node.propValues.push( {
            key,
            value: newNode
          });
        }
        else {
          node.propValues.push( {
            key,
            value
          });
        }
      }
    }

    return node;
  }

  buildPresentationTree(tree, node) {
    for (let key in node) {
      if (node.hasOwnProperty(key)) {
        let val = node[key];
        if (typeof(val) === 'object' && Object.keys(val).length > 0) {
          let newRoot = {};
          tree[key] = newRoot;
          this.buildPresentationTree(newRoot, val);
        }
        else {
          tree[key] = val;
        }
      }
    }
  }

  renderPresentation() {
    if (this.props.presentation.autoplay.BrightAuthor) {

      const tViewTree = [this.buildTree('Presentation', this.props.presentation.autoplay.BrightAuthor)];

      let tree = {};
      this.buildPresentationTree(tree, this.props.presentation.autoplay.BrightAuthor);
      const treeViewTree = [this.recursePresentationNodes('Presentation', tree)];
      debugger;
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

