import { connect } from 'react-redux';

import BooleanInput from '../components/booleanInput';

function mapStateToProps (state) {
  return {
    presentation : state.presentation
  };
}

export default connect(
  mapStateToProps,
)(BooleanInput);
