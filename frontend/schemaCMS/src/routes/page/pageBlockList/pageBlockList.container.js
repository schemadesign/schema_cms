import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { PageBlockList } from './pageBlockList.component';
import { PageBlockRoutines, selectTemporaryPageBlocks, selectPageBlocks } from '../../../modules/pageBlock';
import { PageRoutines, selectPage } from '../../../modules/page';
import { selectUserRole } from '../../../modules/userProfile';
import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
import messages from '../../pageBlock/pageBlock.messages';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  pageBlocks: selectPageBlocks,
  temporaryPageBlocks: selectTemporaryPageBlocks,
  page: selectPage,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchPageBlocks: promisifyRoutine(PageBlockRoutines.fetchList),
      saveTemporaryBlocks: promisifyRoutine(PageBlockRoutines.saveTemporaryBlocks),
      setPageBlocks: promisifyRoutine(PageBlockRoutines.setBlocks),
      fetchPage: promisifyRoutine(PageRoutines.fetchOne),
    },
    dispatch
  ),
});

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl,
  withRouter,
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ pageBlocks }) => pageBlocks,
    handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
      try {
        const pageId = getMatchParam(props, 'pageId');
        const blocks = values.map(({ id, isActive, name }, index) => ({
          isActive,
          name,
          id,
          execOrder: index,
        }));

        await props.setPageBlocks({ pageId, blocks });
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(PageBlockList);
