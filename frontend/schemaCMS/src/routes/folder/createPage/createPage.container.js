import { connect } from 'react-redux';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, path } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { CreatePage } from './createPage.component';
import messages from './createPage.messages';
import { PageRoutines } from '../../../modules/page';
import { PAGE_FORM, INITIAL_VALUES, PAGE_SCHEMA } from '../../../modules/page/page.constants';
import { errorMessageParser } from '../../../shared/utils/helpers';

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      createPage: promisifyRoutine(PageRoutines.create),
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
    mapPropsToValues: () => INITIAL_VALUES,
    validationSchema: () => PAGE_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const folderId = path(['match', 'params', 'folderId'], props);

        await props.createPage({ folderId, ...data });
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(CreatePage);
