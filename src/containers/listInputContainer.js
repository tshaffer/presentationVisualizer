import { connect } from 'react-redux';

import ListInput from '../components/listInput';

function mapStateToProps (state) {
  return {
    presentation : state.presentation
  };
}

export default connect(
  mapStateToProps,
)(ListInput);
