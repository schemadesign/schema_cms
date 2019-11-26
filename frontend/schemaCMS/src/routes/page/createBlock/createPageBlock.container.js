import { connect } from 'react-redux';
import { bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, path } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { CreatePageBlock } from './createPageBlock.component';
import { PageBlockRoutines } from '../../../modules/pageBlock';

import { errorMessageParser } from '../../../shared/utils/helpers';
import { BLOCK_FORM, BLOCK_SCHEMA, INITIAL_VALUES } from '../../../modules/pageBlock/pageBlock.constants';

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      createBlock: PageBlockRoutines.create,
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
    mapPropsToValues: values => ({
      ...INITIAL_VALUES,
      ...values,
    }),
    validationSchema: () => BLOCK_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const pageId = path(['match', 'params', 'pageId'], props);

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
