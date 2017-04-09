import { connect } from 'react-redux';

import TextInput from '../components/textInput';

function mapStateToProps (state) {
  return {
    presentation : state.presentation
  };
}

export default connect(
  mapStateToProps,
)(TextInput);
