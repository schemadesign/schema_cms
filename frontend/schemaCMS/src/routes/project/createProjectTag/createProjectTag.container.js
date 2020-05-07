import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';
import { withFormik } from 'formik';

import { CreateProjectTag } from './createProjectTag.component';
import { ProjectTagRoutines } from '../../../modules/projectTag';
import { selectUserRole } from '../../../modules/userProfile';
import {
  INITIAL_VALUES,
  TAG_FORM,
  TAG_NAME,
  TAG_TAGS,
  TAGS_SCHEMA,
} from '../../../modules/projectTag/projectTag.constants';
import reportError from '../../../shared/utils/reportError';
import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
import messages from './createProjectTag.messages';
import { selectProject } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  project: selectProject,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      createTag: promisifyRoutine(ProjectTagRoutines.createTag),
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
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
        const projectId = getMatchParam(props, 'projectId');
        const tags = data[TAG_TAGS].map((item, index) => ({ ...item, execOrder: index }));
        const formData = {
          tags,
          name: data[TAG_NAME],
        };

        await createTag({ projectId, formData });
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
)(CreateProjectTag);
