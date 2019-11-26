import { connect } from 'react-redux';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, path } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { Edit } from './edit.component';
import { PageRoutines, selectPage } from '../../../modules/page';
import { PAGE_FORM, INITIAL_VALUES, PAGE_SCHEMA } from '../../../modules/page/page.constants';
import { errorMessageParser } from '../../../shared/utils/helpers';

const mapStateToProps = createStructuredSelector({
  page: selectPage,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      updatePage: promisifyRoutine(PageRoutines.update),
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
    displayName: PAGE_FORM,
    enableReinitialize: true,
    mapPropsToValues: ({ page }) => ({ ...INITIAL_VALUES, ...page }),
    validationSchema: () => PAGE_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const pageId = path(['match', 'params', 'pageId'], props);
        const directoryId = path(['page', 'directory', 'id'], props);

        await props.updatePage({ pageId, directoryId, ...data });
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(Edit);
