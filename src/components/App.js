// @flow

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const {dialog} = require('electron').remote;

import TreeView from 'react-treeview';

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


  getPresentation() {

    if (this.props.presentation.autoplay.BrightAuthor) {

      let type = 'meta';
      let label = <span className="node">{type}</span>;
      let label2 = <span className="node">this.props.presentation.autoplay.BrightAuthor.meta.name</span>;
      return (
        <div>
          <TreeView key={type} nodeLabel={label} defaultCollapsed={false}>
            <TreeView nodeLabel='name' key={this.props.presentation.autoplay.BrightAuthor.meta.name}
              defaultCollapsed={false}>
              <div className="info">{this.props.presentation.autoplay.BrightAuthor.meta.name}</div>
            </TreeView>
          </TreeView>
        </div>
      );
    }
    else {
      return (
        <div>cheese pizza</div>
      );
    }
  }

  getPresentationR(tree, node) {
    console.log('entry: ');
    console.log(tree);
    console.log(node);
    for (let key in node) {
      if (node.hasOwnProperty(key)) {
        let val = node[key];
        if (typeof(val) === 'object' && Object.keys(val).length > 0) {
          let newRoot = {};
          tree[key] = newRoot;
          console.log('recurseMe: ', tree);
          this.getPresentationR(newRoot, val);
          console.log('return from recursive call');
        }
        else {
          tree[key] = val;
        }
      }
    }
    console.log('exit: ');
    console.log(tree);
    console.log(node);
  }

  getPresentationH() {
    if (this.props.presentation.autoplay.BrightAuthor) {
      debugger;
      let tree = {};
      this.getPresentationR(tree, this.props.presentation.autoplay.BrightAuthor);
      console.log(tree);
      debugger;
    }
    return (
      <div>poo</div>
    );
  }

// return (
// <div>
// {dataSource.map((node, i) => {
//   const type = node.type;
//   const label = <span className="node">{type}</span>;
//   return (
// <TreeView key={type + '|' + i} nodeLabel={label} defaultCollapsed={false}>
//     {node.people.map(person => {
//       const label2 = <span className="node">{person.name}</span>;
//       return (
//         <TreeView nodeLabel={label2} key={person.name} defaultCollapsed={false}>
//           <div className="info">age: {person.age}</div>
//           <div className="info">sex: {person.sex}</div>
//           <div className="info">role: {person.role}</div>
//         </TreeView>
//       );
//     })}
// </TreeView>
// );
// })}
// </div>
// );


  render() {

    console.log("app.js::render invoked");

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
          {this.getPresentationH()}
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  openPresentation: React.PropTypes.func.isRequired,
  presentation: React.PropTypes.object.isRequired
};

