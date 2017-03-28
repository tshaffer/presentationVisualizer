// @flow

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const {dialog} = require('electron').remote;

import TreeView from 'react-treeview';

let index = 0;

const dataSource = [
  {
    type: 'Employees',
    collapsed: false,
    people: [
      {name: 'Paul Gordon', age: 25, sex: 'male', role: 'coder', collapsed: false},
      {name: 'Sarah Lee', age: 23, sex: 'female', role: 'jqueryer', collapsed: false},
    ],
  },
  {
    type: 'CEO',
    collapsed: false,
    people: [
      {name: 'Drew Anderson', age: 35, sex: 'male', role: 'boss', collapsed: false},
    ],
  },
];

const signProps = [
  {
    propName: 'Color',
    propValues: [
      {
        key: 'red',
        value: 69
      },
      {
        key: 'green',
        value: 169
      },
      {
        key: 'blue',
        value: 96
      }
    ]
  }
];
export default class App extends Component {

  componentDidMount() {
    console.log("app.js::componentDidMount invoked");
    console.log(dataSource);
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


  // getPresentation() {
  //
  //   if (this.props.presentation.autoplay.BrightAuthor) {
  //
  //     let type = 'meta';
  //     let label = <span className="node">{type}</span>;
  //     let label2 = <span className="node">this.props.presentation.autoplay.BrightAuthor.meta.name</span>;
  //     return (
  //       <div>
  //         <TreeView key={type} nodeLabel={label} defaultCollapsed={false}>
  //           <TreeView nodeLabel='name' key={this.props.presentation.autoplay.BrightAuthor.meta.name}
  //             defaultCollapsed={false}>
  //             <div className="info">{this.props.presentation.autoplay.BrightAuthor.meta.name}</div>
  //           </TreeView>
  //         </TreeView>
  //       </div>
  //     );
  //   }
  //   else {
  //     return (
  //       <div>cheese pizza</div>
  //     );
  //   }
  // }


  buildTreeViewRoot(tree, jsx) {

    for (let key in tree) {
      if (tree.hasOwnProperty(key)) {
        let val = tree[key];

        if (typeof(val) === 'object' && Object.keys(val).length > 0) {
          index++;
          jsx.push(
            <TreeView key={index} nodeLabel={key} defaultCollapsed={false}>
              {this.buildTreeViewR(val, jsx)}
            </TreeView>
          );
          console.log('poo');
          // jsx += (
          //   <TreeView key={index} nodeLabel={key} defaultCollapsed={false}>
          //     {this.buildTreeViewR(val, jsx)}
          //   </TreeView >
          // );
        }
        else {
          index++;
          jsx.push(<div className='info' key={index}>{key}: {val.toString()}</div>);
        }
      }
    }

    return jsx;

  }

  getTreeViewItem0() {
    return (
      <TreeView key={'boozle'} nodeLabel={'boozle'} defaultCollapsed={false}>
        <div>choice1</div>
        <div>choice2</div>
      </TreeView>
    );
  }

  getTreeViewItem1() {
    return (
      <div>
        {signProps.map( (signProp) => {
          return (
            <TreeView key={signProp.propName} nodeLabel={signProp.propName} defaultCollapsed={false}>
              {signProp.propValues.map( (propValue, j) => {
                return (
                  <div key={j}>{propValue.key}: {propValue.value}</div>
                );
              })
              }
            </TreeView>
          );
        })}
      </div>
    );
  }
  buildTreeViewPoo(jsx) {

    jsx.push(
      <TreeView key={'pooNode'} nodeLabel={'floozle'} defaultCollapsed={false}>
        {this.getTreeViewItem1()}
      </TreeView>
    );

    return jsx;
  }

  getTreeView(treeNodes) {
    return (
      <div>
        {treeNodes.map( (treeNode) => {
          return (
            <TreeView key={treeNode.propName} nodeLabel={treeNode.propName} defaultCollapsed={false}>
              {treeNode.propValues.map( (propValue, j) => {
                return (
                  <div key={j}>{propValue.key}: {propValue.value}</div>
                );
              })
              }
            </TreeView>
          );
        })}
      </div>
    );
  }

  buildTreeViewR(tree, jsx) {

    jsx.push(
      <TreeView key={'pooNode'} nodeLabel={'floozle'} defaultCollapsed={false}>
        {this.getTreeView(tree)}
      </TreeView>
    );

    return jsx;

  }

  buildTreeViewH(tree) {
    // let treeJsx = this.buildTreeViewR(tree, []);
    let treeJsx = this.buildTreeViewR(tree, []);
    return (
      <TreeView key={'rootNode'} nodeLabel={'presentation'} defaultCollapsed={false}>
        {treeJsx}
      </TreeView>
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
      debugger;
      const treeA = this.convertTreeH(tree);
      console.log(treeA);
      return this.buildTreeViewH(tree);
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

