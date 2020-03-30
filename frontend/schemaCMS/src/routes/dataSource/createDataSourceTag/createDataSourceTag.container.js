import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';
import { withFormik } from 'formik';

import { CreateDataSourceTag } from './createDataSourceTag.component';
import { selectDataSource } from '../../../modules/dataSource';
import { DataSourceTagRoutines } from '../../../modules/dataSourceTag';
import { selectUserRole } from '../../../modules/userProfile';
import {
  INITIAL_VALUES,
  TAG_FORM,
  TAG_NAME,
  TAG_TAGS,
  TAGS_SCHEMA,
} from '../../../modules/dataSourceTag/dataSourceTag.constants';
import reportError from '../../../shared/utils/reportError';
import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
import messages from './createDataSourceTag.messages';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  dataSource: selectDataSource,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      createTag: promisifyRoutine(DataSourceTagRoutines.createTag),
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
  withRouter,
  withFormik({
    displayName: TAG_FORM,
    enableReinitialize: true,
    mapPropsToValues: () => INITIAL_VALUES,
    validationSchema: () => TAGS_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const { createTag } = props;
        const dataSourceId = getMatchParam(props, 'dataSourceId');
        const tags = data[TAG_TAGS].map((item, index) => ({ ...item, execOrder: index }));
        const formData = {
          tags,
          name: data[TAG_NAME],
        };

        await createTag({ dataSourceId, formData });
      } catch (errors) {
        reportError(errors);
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(CreateDataSourceTag);
