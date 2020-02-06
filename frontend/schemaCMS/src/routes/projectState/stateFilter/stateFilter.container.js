import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, propEq, pipe, find, defaultTo, pathOr, pick, reject } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { StateFilter } from './stateFilter.component';
import { FilterRoutines, selectFilter } from '../../../modules/filter';
import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
import messages from '../../project/create/create.messages';
import { ProjectStateRoutines, selectState } from '../../../modules/projectState';
import { selectUserRole } from '../../../modules/userProfile';
import reportError from '../../../shared/utils/reportError';

const mapStateToProps = createStructuredSelector({
  filter: selectFilter,
  state: selectState,
  userRole: selectUserRole,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchFilter: promisifyRoutine(FilterRoutines.fetchFilter),
      updateState: promisifyRoutine(ProjectStateRoutines.update),
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
    isInitialValid: true,
    mapPropsToValues: props =>
      pipe(
        pathOr([], ['state', 'filters']),
        find(propEq('filter', parseInt(getMatchParam(props, 'filterId'), 10))),
        defaultTo({ values: [] }),
        pick(['values'])
      )(props),
    handleSubmit: async ({ values }, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const stateId = getMatchParam(props, 'stateId');
        const filter = getMatchParam(props, 'filterId');
        const filters = reject(propEq('filter', parseInt(filter, 10)), props.state.filters).concat({ filter, values });
        const redirectUrl = `/state/${stateId}/filters`;

        await props.updateState({ formData: { filters }, stateId, redirectUrl });
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
)(StateFilter);
