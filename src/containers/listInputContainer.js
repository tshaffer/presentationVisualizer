import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  setPresentationItemValue,
} from '../store/presentation';

import ListInput from '../components/listInput';

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
)(ListInput);
