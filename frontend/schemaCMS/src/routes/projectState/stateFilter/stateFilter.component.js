import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { always, append, cond, equals, ifElse, pathOr, propEq, reject, T } from 'ramda';
import { Form as FormUI } from 'schemaUI';

import { Form, RangeInput, RangeValues } from './stateFilter.styles';
import messages from './stateFilter.messages';
import reportError from '../../../shared/utils/reportError';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions, PROJECT_STATE_ID } from '../../project/project.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import {
  PROJECT_STATE_FILTER_FIELD,
  PROJECT_STATE_FILTER_NAME,
  PROJECT_STATE_FILTER_SECONDARY_VALUES,
  PROJECT_STATE_FILTER_TYPE,
  PROJECT_STATE_FILTER_VALUES,
} from '../../../modules/projectState/projectState.constants';
import { Select } from '../../../shared/components/form/select';
import {
  FILTER_TYPE_BOOL,
  FILTER_TYPE_CHECKBOX,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_SELECT,
} from '../../../modules/filter/filter.constants';
import { RangeSlider } from '../../../shared/components/rangeSlider';

const { CheckboxGroup, Checkbox, Label, Switch } = FormUI;

export class StateFilter extends PureComponent {
  static propTypes = {
    fetchFilter: PropTypes.func.isRequired,
    fetchFieldsInfo: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    state: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    filter: PropTypes.object.isRequired,
    fieldsInfo: PropTypes.array.isRequired,
    userRole: PropTypes.string.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        filterId: PropTypes.string.isRequired,
      }),
    }),
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const filterId = getMatchParam(this.props, 'filterId');

      const { filterType, field, datasource } = await this.props.fetchFilter({ filterId });
      if ([FILTER_TYPE_SELECT, FILTER_TYPE_CHECKBOX, FILTER_TYPE_RANGE].includes(filterType)) {
        await this.props.fetchFieldsInfo({ dataSourceId: datasource.id, field });
      }

      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  getUniqueValues = () => pathOr([], ['props', 'fieldsInfo'], this);

  getStatusOptions = () =>
    this.getUniqueValues().map(name => ({
      value: name,
      label: name,
    }));

  handleBack = () => this.props.history.push(`/state/${this.props.state.id}/filters`);

  handleSelectStatus = ({ value }) => {
    this.props.setFieldValue(PROJECT_STATE_FILTER_VALUES, [value]);
  };

  handleCheckboxChange = e => {
    const { value, checked } = e.target;
    const {
      setFieldValue,
      values: { values },
    } = this.props;
    const setValues = ifElse(equals(true), always(append(value, values)), always(reject(equals(value), values)));

    setFieldValue(PROJECT_STATE_FILTER_VALUES, setValues(checked));
  };

  handleRangeChange = e => {
    const { values } = this.props;
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

    this.props.setFieldValue(`${PROJECT_STATE_FILTER_SECONDARY_VALUES}.${index}`, intValue);
    this.props.setFieldValue(name, intValue);
  };

  handleInputRangeChange = (e, isBlur) => {
    const { target } = e;
    const { name, value } = target;
    const [, index] = name.split('.');
    const intIndex = parseInt(index, 10);
    const intValue = parseInt(value, 10);
    const { values, setFieldValue } = this.props;
    const [minRounded, maxRounded] = values.range;

    if ((isBlur && (intValue < minRounded || intValue > maxRounded)) || (isBlur && isNaN(intValue))) {
      setFieldValue(name, values[PROJECT_STATE_FILTER_VALUES][intIndex]);
      return;
    }

    setFieldValue(name, intValue);
    if (intValue >= minRounded && intValue <= maxRounded) {
      setFieldValue(`${PROJECT_STATE_FILTER_VALUES}.${index}`, intValue);
    }
  };

  renderRange = () => {
    const { values, intl } = this.props;
    const [minRounded, maxRounded] = values.range;
    const [minValue, maxValue] = values[PROJECT_STATE_FILTER_VALUES];

    return (
      <Fragment>
        <RangeSlider
          minValue={minValue}
          maxValue={maxValue}
          idMin={`${PROJECT_STATE_FILTER_VALUES}.0`}
          idMax={`${PROJECT_STATE_FILTER_VALUES}.1`}
          min={minRounded}
          max={maxRounded}
          onChange={this.handleRangeChange}
        />
        <RangeValues>
          <span>{minRounded}</span>
          <span>{maxRounded}</span>
        </RangeValues>
        <RangeValues>
          <RangeInput>
            <TextInput
              value={values[PROJECT_STATE_FILTER_SECONDARY_VALUES][0]}
              onChange={this.handleInputRangeChange}
              onBlur={e => this.handleInputRangeChange(e, true)}
              name={`${PROJECT_STATE_FILTER_SECONDARY_VALUES}.0`}
              label={intl.formatMessage(messages.min)}
              type="number"
              step="1"
              min={minRounded}
              max={maxValue - 1}
              {...this.props}
            />
          </RangeInput>
          <RangeInput>
            <TextInput
              value={values[PROJECT_STATE_FILTER_SECONDARY_VALUES][1]}
              onChange={this.handleInputRangeChange}
              onBlur={e => this.handleInputRangeChange(e, true)}
              name={`${PROJECT_STATE_FILTER_SECONDARY_VALUES}.1`}
              label={intl.formatMessage(messages.max)}
              type="number"
              step="1"
              min={minValue + 1}
              max={maxRounded}
              {...this.props}
            />
          </RangeInput>
        </RangeValues>
      </Fragment>
    );
  };

  renderInput = () => (
    <TextInput
      value={this.props.values[PROJECT_STATE_FILTER_VALUES][0]}
      onChange={this.props.handleChange}
      name={`${PROJECT_STATE_FILTER_VALUES}.0`}
      label={this.props.intl.formatMessage(messages[PROJECT_STATE_FILTER_VALUES])}
      fullWidth
      isEdit
      {...this.props}
    />
  );

  renderSelect = () => (
    <Select
      label={this.props.intl.formatMessage(messages[PROJECT_STATE_FILTER_VALUES])}
      name={PROJECT_STATE_FILTER_VALUES}
      value={this.props.values[PROJECT_STATE_FILTER_VALUES][0]}
      options={this.getStatusOptions()}
      onSelect={this.handleSelectStatus}
      placeholder={this.props.intl.formatMessage(messages.selectPlaceholder)}
    />
  );

  renderCheckbox = (name, index) => (
    <Checkbox key={index} id={`checkbox-${index}`} value={name}>
      {name}
    </Checkbox>
  );

  renderCheckboxes = () => (
    <Fragment>
      <Label>
        <FormattedMessage {...messages[PROJECT_STATE_FILTER_VALUES]} />
      </Label>
      <CheckboxGroup
        onChange={this.handleCheckboxChange}
        name={PROJECT_STATE_FILTER_VALUES}
        customStyles={{ borderTop: 'none' }}
        value={this.props.values[PROJECT_STATE_FILTER_VALUES]}
      >
        {this.getUniqueValues().map(this.renderCheckbox)}
      </CheckboxGroup>
    </Fragment>
  );

  renderSwitch = () => (
    <Switch
      value={this.props.values[PROJECT_STATE_FILTER_VALUES][0]}
      id={`${PROJECT_STATE_FILTER_VALUES}.0`}
      onChange={this.props.handleChange}
      label={this.props.intl.formatMessage(messages[PROJECT_STATE_FILTER_VALUES])}
    />
  );

  renderValue = data =>
    cond([
      [propEq('filterType', FILTER_TYPE_RANGE), this.renderRange],
      [propEq('filterType', FILTER_TYPE_SELECT), this.renderSelect],
      [propEq('filterType', FILTER_TYPE_CHECKBOX), this.renderCheckboxes],
      [propEq('filterType', FILTER_TYPE_BOOL), this.renderSwitch],
      [T, this.renderInput],
    ])(data);

  render() {
    const { loading, error } = this.state;
    const { userRole, handleSubmit, isSubmitting, isValid, state, intl, filter } = this.props;
    const projectId = state.project;
    const menuOptions = getProjectMenuOptions(projectId);
    const title = state.name;
    const { filterType, fieldType } = filter;

    return (
      <Fragment>
        <Helmet title={title} />
        <MobileMenu
          headerTitle={title}
          headerSubtitle={<FormattedMessage {...messages.subTitle} />}
          options={filterMenuOptions(menuOptions, userRole)}
          active={PROJECT_STATE_ID}
        />
        <ContextHeader title={title} subtitle={<FormattedMessage {...messages.subTitle} />} />
        <LoadingWrapper loading={loading} error={error}>
          <Form onSubmit={handleSubmit}>
            <TextInput
              value={filter[PROJECT_STATE_FILTER_NAME]}
              name={PROJECT_STATE_FILTER_NAME}
              label={intl.formatMessage(messages[PROJECT_STATE_FILTER_NAME])}
              fullWidth
              disabled
              {...this.props}
            />
            <TextInput
              value={filter[PROJECT_STATE_FILTER_TYPE]}
              name={PROJECT_STATE_FILTER_TYPE}
              label={intl.formatMessage(messages[PROJECT_STATE_FILTER_TYPE])}
              fullWidth
              disabled
              {...this.props}
            />
            <TextInput
              value={filter[PROJECT_STATE_FILTER_FIELD]}
              name={PROJECT_STATE_FILTER_FIELD}
              label={intl.formatMessage(messages[PROJECT_STATE_FILTER_FIELD])}
              fullWidth
              disabled
              {...this.props}
            />
            {this.renderValue({ filterType, fieldType })}
            <NavigationContainer fixed>
              <BackButton type="button" onClick={this.handleBack} />
              <NextButton type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid}>
                <FormattedMessage {...messages.save} />
              </NextButton>
            </NavigationContainer>
          </Form>
        </LoadingWrapper>
      </Fragment>
    );
  }
}
