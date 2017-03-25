import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { openPresentation } from '../store/presentations';

import App from '../components/App';

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    openPresentation,
  }, dispatch);
};

export default connect(
  null,
  mapDispatchToProps
)(App);
