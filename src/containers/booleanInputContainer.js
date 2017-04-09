import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  setPresentationItemValue,
} from '../store/presentation';

import BooleanInput from '../components/booleanInput';

function mapStateToProps (state) {
  return {
    presentation : state.presentation
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setPresentationItemValue,
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BooleanInput);
