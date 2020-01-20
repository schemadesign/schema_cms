import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { CreatePageBlock } from './createPageBlock.component';
import { PageBlockRoutines } from '../../../modules/pageBlock';
import messages from './createPageBlock.messages';

import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
import { BLOCK_FORM, BLOCK_SCHEMA, INITIAL_VALUES } from '../../../modules/pageBlock/pageBlock.constants';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      createBlock: promisifyRoutine(PageBlockRoutines.create),
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter,
  injectIntl,
  withFormik({
    displayName: BLOCK_FORM,
    enableReinitialize: true,
    mapPropsToValues: () => INITIAL_VALUES,
    validationSchema: () => BLOCK_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const pageId = getMatchParam(props, 'pageId');

        await props.createBlock({ pageId, ...data });
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(CreatePageBlock);
