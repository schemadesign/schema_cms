import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, path, pickBy } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { PageBlock } from './pageBlock.component';
import { PageBlockRoutines, selectPageBlock } from '../../modules/pageBlock';
import messages from './pageBlock.messages';

import { errorMessageParser, getMatchParam } from '../../shared/utils/helpers';
import { BLOCK_CONTENT, BLOCK_FORM, BLOCK_SCHEMA, INITIAL_VALUES } from '../../modules/pageBlock/pageBlock.constants';

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
    mapPropsToValues: ({ block: { name, type, content, images = [] } }) => ({
      ...INITIAL_VALUES,
      name,
      type,
      [`${type}-${BLOCK_CONTENT}`]: content,
      imageNames: images,
    }),
    validationSchema: () => BLOCK_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const blockId = getMatchParam(props, 'blockId');
        const pageId = path(['block', 'page', 'id'], props);
        const requestData = pickBy((val, key) => val !== props.block[key], data);

        await props.updatePageBlock({ blockId, pageId, blockType: data.type, ...requestData });
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
