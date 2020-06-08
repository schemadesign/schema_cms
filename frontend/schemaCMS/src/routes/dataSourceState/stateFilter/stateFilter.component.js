import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { always, cond, equals, ifElse, propEq, T, map, identity, propOr, update, concat, findIndex, lte } from 'ramda';
import { Form as FormUI } from 'schemaUI';
import { useEffectOnce } from 'react-use';
import { useParams, useLocation, useHistory } from 'react-router';
import { useFormik } from 'formik';
import { asMutable } from 'seamless-immutable';

import { Form, RangeInput, RangeValues } from './stateFilter.styles';
import messages from './stateFilter.messages';
import reportError from '../../../shared/utils/reportError';
import { filterMenuOptions, getInitialStateFilterValue } from '../../../shared/utils/helpers';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions, DATA_SOURCE_STATE_ID } from '../../project/project.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import {
  DATA_SOURCE_STATE_FILTER_FIELD,
  DATA_SOURCE_STATE_FILTER_NAME,
  DATA_SOURCE_STATE_FILTER_SECONDARY_VALUES,
  DATA_SOURCE_STATE_FILTER_TYPE,
  DATA_SOURCE_STATE_FILTER_VALUES,
  DATA_SOURCE_STATE_FILTERS,
} from '../../../modules/dataSourceState/dataSourceState.constants';
import {
  FILTER_TYPE_BOOL,
  FILTER_TYPE_CHECKBOX,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_SELECT,
} from '../../../modules/filter/filter.constants';
import { RangeSlider } from '../../../shared/components/rangeSlider';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { MultiSelect } from '../../../shared/components/form/multiSelect/multiSelect.component';

const { Label, Switch } = FormUI;

export const StateFilter = ({ fetchFilter, fetchFieldsInfo, fieldsInfo, userRole, project, filter }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const filterId = parseInt(params.filterId, 10);
  const { state: locationState = {} } = useLocation();
  const state = propOr({ name: '', [DATA_SOURCE_STATE_FILTERS]: [] }, 'state', locationState);
  const history = useHistory();
  const intl = useIntl();
  const projectId = project.id;
  const menuOptions = getProjectMenuOptions(projectId);
  const title = state.name;

  useEffectOnce(() => {
    (async () => {
      try {
        const { filterType, field, datasource } = await fetchFilter({ filterId });
        if ([FILTER_TYPE_SELECT, FILTER_TYPE_CHECKBOX, FILTER_TYPE_RANGE].includes(filterType)) {
          await fetchFieldsInfo({ dataSourceId: datasource.id, field });
        }
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  const { values, setFieldValue, handleChange, handleSubmit, dirty, ...restFormikProps } = useFormik({
    initialValues: getInitialStateFilterValue({ state, filter, filterId, fieldsInfo }),
    enableReinitialize: true,
    onSubmit: ({ values }) => {
      const newState = { ...state };
      const filterIndex = findIndex(propEq('filter', filterId), state.filters);
      newState.filters = ifElse(
        lte(0),
        () => update(filterIndex, { values, filter: filterId }, state.filters),
        always(concat(state.filters, [{ values, filter: filterId }]))
      )(filterIndex);

      history.push(locationState.backUrl, { state: newState });
    },
  });

  const handleBack = () => history.push(locationState.backUrl, { state });

  const handleMultiSelectChange = value =>
    setFieldValue(DATA_SOURCE_STATE_FILTER_VALUES, value ? value.map(({ value }) => value) : []);

  const handleRangeChange = e => {
    const { target } = e;
    const { name, value } = target;
    const [key, index] = name.split('.');
    const intValue = parseInt(value, 10);
    const intIndex = parseInt(index, 10);

    if (intIndex && intValue < values[key][0] + 1) {
      return;
    }
    if (!intIndex && intValue > values[key][1] - 1) {
      return;
    }

    setFieldValue(`${DATA_SOURCE_STATE_FILTER_SECONDARY_VALUES}.${index}`, intValue);
    setFieldValue(name, intValue);
  };

  const handleInputRangeChange = (e, isBlur) => {
    const { target } = e;
    const { name, value } = target;
    const [, index] = name.split('.');
    const intIndex = parseInt(index, 10);
    const intValue = parseInt(value, 10);
    const [minRounded, maxRounded] = values.range;

    if ((isBlur && (intValue < minRounded || intValue > maxRounded)) || (isBlur && isNaN(intValue))) {
      setFieldValue(name, values[DATA_SOURCE_STATE_FILTER_VALUES][intIndex]);
      return;
    }

    setFieldValue(name, intValue);
    if (intValue >= minRounded && intValue <= maxRounded) {
      setFieldValue(`${DATA_SOURCE_STATE_FILTER_VALUES}.${index}`, intValue);
    }
  };

  const renderRange = () => {
    const [minRounded, maxRounded] = values.range;
    const [minValue, maxValue] = values[DATA_SOURCE_STATE_FILTER_VALUES];
    const [minSecondaryValue, maxSecondaryValue] = map(ifElse(equals(NaN), always(''), identity))(
      values[DATA_SOURCE_STATE_FILTER_SECONDARY_VALUES]
    );

    return (
      <Fragment>
        <RangeSlider
          minValue={minValue}
          maxValue={maxValue}
          idMin={`${DATA_SOURCE_STATE_FILTER_VALUES}.0`}
          idMax={`${DATA_SOURCE_STATE_FILTER_VALUES}.1`}
          min={minRounded}
          max={maxRounded}
          onChange={handleRangeChange}
        />
        <RangeValues>
          <span>{minRounded}</span>
          <span>{maxRounded}</span>
        </RangeValues>
        <RangeValues>
          <RangeInput>
            <TextInput
              value={minSecondaryValue}
              onChange={handleInputRangeChange}
              onBlur={e => handleInputRangeChange(e, true)}
              name={`${DATA_SOURCE_STATE_FILTER_SECONDARY_VALUES}.0`}
              label={intl.formatMessage(messages.min)}
              type="number"
              step="1"
              min={minRounded}
              max={maxValue - 1}
              {...restFormikProps}
            />
          </RangeInput>
          <RangeInput>
            <TextInput
              value={maxSecondaryValue}
              onChange={handleInputRangeChange}
              onBlur={e => handleInputRangeChange(e, true)}
              name={`${DATA_SOURCE_STATE_FILTER_SECONDARY_VALUES}.1`}
              label={intl.formatMessage(messages.max)}
              type="number"
              step="1"
              min={minValue + 1}
              max={maxRounded}
              {...restFormikProps}
            />
          </RangeInput>
        </RangeValues>
      </Fragment>
    );
  };

  const renderInput = () => (
    <TextInput
      value={values[DATA_SOURCE_STATE_FILTER_VALUES][0] || ''}
      onChange={handleChange}
      name={`${DATA_SOURCE_STATE_FILTER_VALUES}.0`}
      label={intl.formatMessage(messages[DATA_SOURCE_STATE_FILTER_VALUES])}
      fullWidth
      isEdit
      {...restFormikProps}
    />
  );

  const renderSelect = isSingleSelect => {
    const mutableFieldsInfo = asMutable(fieldsInfo);
    const selectedOptions = values[DATA_SOURCE_STATE_FILTER_VALUES];
    const isDisabled = isSingleSelect && selectedOptions.length > 0;
    const options = mutableFieldsInfo.map(item => ({ value: item, label: item, isDisabled }));
    const value = selectedOptions.map(item => ({ value: item, label: item }));
    const isLastOption = isSingleSelect || options.length - selectedOptions.length === 1;
    const limit = isSingleSelect ? 1 : options.length;

    return (
      <Fragment>
        <Label>
          <FormattedMessage {...messages[DATA_SOURCE_STATE_FILTER_VALUES]} />
        </Label>
        <MultiSelect
          options={options}
          value={value}
          onChange={handleMultiSelectChange}
          closeMenuOnSelect={isLastOption}
          limit={limit}
        />
      </Fragment>
    );
  };

  const renderSwitch = () => (
    <Switch
      value={values[DATA_SOURCE_STATE_FILTER_VALUES][0]}
      id={`${DATA_SOURCE_STATE_FILTER_VALUES}.0`}
      onChange={handleChange}
      label={intl.formatMessage(messages[DATA_SOURCE_STATE_FILTER_VALUES])}
    />
  );

  const renderValue = cond([
    [propEq('filterType', FILTER_TYPE_RANGE), renderRange],
    [propEq('filterType', FILTER_TYPE_SELECT), () => renderSelect(true)],
    [propEq('filterType', FILTER_TYPE_CHECKBOX), () => renderSelect(false)],
    [propEq('filterType', FILTER_TYPE_BOOL), renderSwitch],
    [T, renderInput],
  ]);

  const renderForm = loading =>
    renderWhenTrue(() => {
      const { filterType, fieldType } = filter;

      return (
        <Form onSubmit={handleSubmit}>
          <TextInput
            value={filter[DATA_SOURCE_STATE_FILTER_NAME]}
            name={DATA_SOURCE_STATE_FILTER_NAME}
            label={intl.formatMessage(messages[DATA_SOURCE_STATE_FILTER_NAME])}
            fullWidth
            disabled
            {...restFormikProps}
          />
          <TextInput
            value={filter[DATA_SOURCE_STATE_FILTER_TYPE]}
            name={DATA_SOURCE_STATE_FILTER_TYPE}
            label={intl.formatMessage(messages[DATA_SOURCE_STATE_FILTER_TYPE])}
            fullWidth
            disabled
            {...restFormikProps}
          />
          <TextInput
            value={filter[DATA_SOURCE_STATE_FILTER_FIELD]}
            name={DATA_SOURCE_STATE_FILTER_FIELD}
            label={intl.formatMessage(messages[DATA_SOURCE_STATE_FILTER_FIELD])}
            fullWidth
            disabled
            {...restFormikProps}
          />
          {renderValue({ filterType, fieldType })}
          <NavigationContainer fixed>
            <BackButton type="button" onClick={handleBack} />
            <NextButton type="submit" disabled={!dirty}>
              <FormattedMessage {...messages.save} />
            </NextButton>
          </NavigationContainer>
        </Form>
      );
    })(!loading);

  return (
    <Fragment>
      <Helmet title={title} />
      <MobileMenu
        headerTitle={title}
        headerSubtitle={<FormattedMessage {...messages.subTitle} />}
        options={filterMenuOptions(menuOptions, userRole)}
        active={DATA_SOURCE_STATE_ID}
      />
      <ContextHeader title={title} subtitle={<FormattedMessage {...messages.subTitle} />} />
      <LoadingWrapper loading={loading} error={error}>
        {renderForm(loading)}
      </LoadingWrapper>
    </Fragment>
  );
};

StateFilter.propTypes = {
  fetchFilter: PropTypes.func.isRequired,
  fetchFieldsInfo: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  fieldsInfo: PropTypes.array.isRequired,
  userRole: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
};
