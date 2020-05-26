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
import { DataSourceStateRoutines, selectState } from '../../../modules/dataSourceState';
import { selectUserRole } from '../../../modules/userProfile';
import reportError from '../../../shared/utils/reportError';
import { DataSourceRoutines, selectFieldsInfo } from '../../../modules/dataSource';
import {
  PROJECT_STATE_FILTER_SCHEMA,
  PROJECT_STATE_FILTER_SECONDARY_VALUES,
} from '../../../modules/dataSourceState/dataSourceState.constants';
import { FILTER_TYPE_BOOL, FILTER_TYPE_RANGE } from '../../../modules/filter/filter.constants';

const mapStateToProps = createStructuredSelector({
  filter: selectFilter,
  state: selectState,
  userRole: selectUserRole,
  fieldsInfo: selectFieldsInfo,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchFilter: promisifyRoutine(FilterRoutines.fetchFilter),
      updateState: promisifyRoutine(DataSourceStateRoutines.update),
      fetchFieldsInfo: promisifyRoutine(DataSourceRoutines.fetchFieldsInfo),
    },
    dispatch
  ),
});

const getInitialValues = props => {
  const { values } = pipe(
    pathOr([], ['state', 'filters']),
    find(propEq('filter', parseInt(getMatchParam(props, 'filterId'), 10))),
    defaultTo({ values: [] }),
    pick(['values'])
  )(props);
  if (FILTER_TYPE_RANGE === props.filter.filterType) {
    const data = { range: [] };
    if (props.fieldsInfo.length) {
      const [min, max] = props.fieldsInfo;
      data.range = [parseInt(min, 10), parseInt(max % 1 ? max + 1 : max, 10)];
    }

    if (values.length) {
      data.values = values;
      data[PROJECT_STATE_FILTER_SECONDARY_VALUES] = values;
    } else {
      data.values = data.range;
      data[PROJECT_STATE_FILTER_SECONDARY_VALUES] = data.range;
    }

    return data;
  }

  return { values, range: [], [PROJECT_STATE_FILTER_SECONDARY_VALUES]: [] };
};

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
    isInitialValid: ({ filter: { filterType } }) => [FILTER_TYPE_RANGE, FILTER_TYPE_BOOL].includes(filterType),
    validationSchema: () => PROJECT_STATE_FILTER_SCHEMA,
    mapPropsToValues: getInitialValues,
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
