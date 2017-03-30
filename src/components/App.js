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

  getEmbeddedJsx(embeddedTreeNodes) {

    const propName = embeddedTreeNodes[0].propName;
    const treeViewLabel = <span className="node">{propName}</span>;

    let jsx = embeddedTreeNodes[0].propValues.map( (propValue) => {
      const label = <span className="info">{propValue.key}</span>;

      const val = propValue.value;
      let value = 'TBD';
      if (typeof(val) === 'string' || typeof(val) === 'number' || typeof(val) === 'boolean') {
        value = <span className="info">{val.toString()}</span>;
        return (
          <div key={this.getRandom()}>{label}: {value}</div>
        );
      }
      else if (typeof(val) === 'object' && (val instanceof Array) && (val.length === 0)) {
        return (
          <div key={this.getRandom()}>{label}: {'empty'}</div>
        );
      }
      else {
        embeddedTreeNodes = [];
        embeddedTreeNodes.push( {
          propName: val.propName,
          propValues: val.propValues
        });

        return this.getEmbeddedJsx(embeddedTreeNodes);
      }
    });

    return (
      <TreeView key={this.getRandom()} nodeLabel={treeViewLabel} defaultCollapsed={false}>
        {jsx}
      </TreeView>
    );
  }

  getTreeView(treeNodes) {
    return (
      <div>
        {treeNodes.map( (treeNode) => {
          const label = <span className="node">{treeNode.propName}</span>;
          return (
            <TreeView key={this.getRandom()} nodeLabel={label} defaultCollapsed={false}>
              {treeNode.propValues.map( (propValue) => {
                const val = propValue.value;
                const keyLabel = <span className="info">{propValue.key}</span>;
                const valueLabel = <span className="info">{propValue.value.toString()}</span>;
                if (typeof(val) === 'string' || typeof(val) === 'number' || typeof(val) == 'boolean') {
                  return (
                    <div key={this.getRandom()}>{keyLabel}: {valueLabel}</div>
                  );
                }
                else {

                  let embeddedTreeNodes = [];
                  embeddedTreeNodes.push( {
                    propName: val.propName,
                    propValues: val.propValues
                  });

                  return this.getEmbeddedJsx(embeddedTreeNodes);
                }
              })}
            </TreeView>
          );
        })}
      </div>
    );
  }


  buildTreeViewH(tree) {

    const treeViewJsx = this.getTreeView(tree);

    return (
      <div key={this.getRandom()}>
        {treeViewJsx}
      </div>
    );
  }


  convertTreeR(nodeName, nodeIn) {

    let node = {};
    node.propName = nodeName;
    node.propValues = [];

    for (let key in nodeIn) {
      if (nodeIn.hasOwnProperty(key)) {
        let value = nodeIn[key];
        if (typeof(value) === 'object' && Object.keys(value).length > 0) {
          const newNode = this.convertTreeR(key, value);
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

  convertTreeH(treeIn) {
    let treeOut = [];
    const convertedTree = this.convertTreeR('Presentation', treeIn);
    treeOut.push(convertedTree);
    return treeOut;
  }

  getPresentationR(tree, node) {
    for (let key in node) {
      if (node.hasOwnProperty(key)) {
        let val = node[key];
        if (typeof(val) === 'object' && Object.keys(val).length > 0) {
          let newRoot = {};
          tree[key] = newRoot;
          this.getPresentationR(newRoot, val);
        }
        else {
          tree[key] = val;
        }
      }
    }
  }

  getPresentationH() {
    if (this.props.presentation.autoplay.BrightAuthor) {
      let tree = {};
      this.getPresentationR(tree, this.props.presentation.autoplay.BrightAuthor);
      const treeA = this.convertTreeH(tree);
      return this.buildTreeViewH(treeA);
    }
    return (
      <div>
        <span>flibbet</span>
      </div>
    );
  }

  render() {

    console.log("app.js::render invoked");

    let self = this;

    let presentationTree = this.getPresentationH();
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
          {presentationTree}
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  openPresentation: React.PropTypes.func.isRequired,
  presentation: React.PropTypes.object.isRequired
};

