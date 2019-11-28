import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, path } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { PageBlock } from './pageBlock.component';
import { PageBlockRoutines, selectPageBlock } from '../../modules/pageBlock';
import messages from './pageBlock.messages';

import { errorMessageParser } from '../../shared/utils/helpers';
import { BLOCK_FORM, BLOCK_SCHEMA, INITIAL_VALUES } from '../../modules/pageBlock/pageBlock.constants';

const mapStateToProps = createStructuredSelector({
  block: selectPageBlock,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      updatePageBlock: promisifyRoutine(PageBlockRoutines.update),
      fetchPageBlock: promisifyRoutine(PageBlockRoutines.fetchOne),
      removePageBlock: promisifyRoutine(PageBlockRoutines.removeOne),
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
    mapPropsToValues: ({ block: { name, type, content, image, imageName } }) => ({
      ...INITIAL_VALUES,
      name,
      type,
      content,
      image,
      imageName,
    }),
    validationSchema: () => BLOCK_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const blockId = path(['match', 'params', 'blockId'], props);
        const pageId = path(['block', 'page', 'id'], props);

        await props.updatePageBlock({ blockId, pageId, ...data });
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(PageBlock);
