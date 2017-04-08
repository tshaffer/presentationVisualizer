import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  openPresentation,
  savePresentation
} from '../store/presentation';

import App from '../components/App';

function mapStateToProps (state) {
  return {
    presentation : state.presentation
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openPresentation,
    savePresentation,
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
