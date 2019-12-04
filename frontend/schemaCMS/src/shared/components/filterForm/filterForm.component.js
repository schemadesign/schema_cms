import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';
import { always, equals, ifElse, keys, map, path, pathOr, pipe, toString } from 'ramda';

import { TextInput } from '../form/inputs/textInput';
import messages from './filterForm.messages';
import {
  FILTER_FIELD,
  FILTER_FIELD_TYPE,
  FILTER_NAME,
  FILTER_TYPE,
  FILTER_UNIQUE_ITEMS,
  FILTERS_SCHEMA,
  INITIAL_VALUES,
} from '../../../modules/filter/filter.constants';
import { Select } from '../form/select';
import { Form, Row } from './filterForm.styles';
import { BackButton, NavigationContainer, NextButton } from '../navigation';
import { ModalActions, modalStyles, ModalTitle, Modal } from '../modal/modal.styles';
import { FILTERS_PAGE } from '../../../modules/dataSource/dataSource.constants';
import { Link, LinkContainer } from '../../../theme/typography';
import { renderWhenTrue } from '../../utils/rendering';

export class FilterForm extends PureComponent {
  static propTypes = {
    fieldsInfo: PropTypes.object.isRequired,
    createFilter: PropTypes.func,
    updateFilter: PropTypes.func,
    removeFilter: PropTypes.func,
    filter: PropTypes.object,
    dataSourceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    filter: {},
  };

  state = {
    confirmationModalOpen: false,
  };

  getBackMessageId = ifElse(equals(true), always('cancel'), always('back'));

  getDependencyValues = value => ({
    uniqueItems: path(['fieldsInfo', value, FILTER_UNIQUE_ITEMS], this.props),
    fieldType: path(['fieldsInfo', value, FILTER_FIELD_TYPE], this.props),
    filterType: path(['fieldsInfo', value, FILTER_TYPE, 0], this.props),
  });

  getFilerTypes = value => pathOr([], ['fieldsInfo', value, FILTER_TYPE], this.props);

  handleSelectField = ({ value, setFieldValue, filterTypes }) => {
    const { uniqueItems, fieldType, filterType } = this.getDependencyValues(value);

    setFieldValue(FILTER_UNIQUE_ITEMS, toString(uniqueItems));
    setFieldValue(FILTER_FIELD_TYPE, fieldType);
    setFieldValue(FILTER_FIELD, value);

    if (!filterTypes.includes(filterType)) {
      filterTypes = this.getFilerTypes(value);
      setFieldValue(FILTER_TYPE, filterTypes[0]);
    }
  };

  handleSelectType = ({ value, setFieldValue }) => setFieldValue(FILTER_TYPE, value);

  handleRemoveFilter = () => this.setState({ confirmationModalOpen: true });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  handleBack = () => this.props.history.push(`/datasource/${this.props.dataSourceId}/${FILTERS_PAGE}`);

  handleConfirmRemove = () => {
    const { datasource, id: filterId } = this.props.filter;
    this.props.removeFilter({ dataSourceId: datasource.id, filterId });
  };

  handleSubmit = formData => {
    const submitFunc = this.props.createFilter || this.props.updateFilter;
    const dataSourceId = this.props.dataSourceId;
    submitFunc({ dataSourceId, filterId: this.props.filter.id, formData });
  };

  renderRemoveFilterLink = renderWhenTrue(
    always(
      <LinkContainer>
        <Link onClick={this.handleRemoveFilter}>
          <FormattedMessage {...messages.deleteFilter} />
        </Link>
      </LinkContainer>
    )
  );

  render() {
    const fieldOptions = pipe(
      keys,
      map(key => ({ value: key, label: key }))
    )(this.props.fieldsInfo);
    const fieldValue = this.props.filter[FILTER_FIELD] || fieldOptions[0].value;
    const { uniqueItems, fieldType, filterType } = this.getDependencyValues(fieldValue);
    const initialValues = {
      ...INITIAL_VALUES,
      [FILTER_TYPE]: filterType,
      ...this.props.filter,
      [FILTER_FIELD]: fieldValue,
      [FILTER_UNIQUE_ITEMS]: toString(uniqueItems),
      [FILTER_FIELD_TYPE]: fieldType,
    };

    return (
      <Fragment>
        <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validationSchema={FILTERS_SCHEMA}>
          {({ values, handleChange, setFieldValue, dirty, isValid, isSubmitting, ...rest }) => {
            const filterTypes = this.getFilerTypes(values[FILTER_FIELD]);
            const filterTypeOptions = filterTypes.map(key => ({
              value: key,
              label: key,
            }));

            return (
              <Form>
                <TextInput
                  value={values[FILTER_NAME]}
                  onChange={handleChange}
                  name={FILTER_NAME}
                  fullWidth
                  isEdit
                  label={<FormattedMessage {...messages[FILTER_NAME]} />}
                  {...rest}
                />
                <Select
                  label={<FormattedMessage {...messages[FILTER_FIELD]} />}
                  name={FILTER_FIELD}
                  value={values[FILTER_FIELD]}
                  options={fieldOptions}
                  onSelect={({ value }) => this.handleSelectField({ value, setFieldValue, filterTypes })}
                />
                <Select
                  label={<FormattedMessage {...messages[FILTER_TYPE]} />}
                  name={FILTER_TYPE}
                  value={values[FILTER_TYPE]}
                  options={filterTypeOptions}
                  onSelect={({ value }) => this.handleSelectType({ value, setFieldValue })}
                />
                <Row>
                  <TextInput
                    value={values[FILTER_FIELD_TYPE]}
                    name={FILTER_FIELD_TYPE}
                    fullWidth
                    label={<FormattedMessage {...messages[FILTER_FIELD_TYPE]} />}
                    disabled
                    {...rest}
                  />
                  <TextInput
                    value={values[FILTER_UNIQUE_ITEMS]}
                    name={FILTER_UNIQUE_ITEMS}
                    fullWidth
                    label={<FormattedMessage {...messages[FILTER_UNIQUE_ITEMS]} />}
                    disabled
                    {...rest}
                  />
                </Row>
                {this.renderRemoveFilterLink(!!this.props.filter.id)}
                <NavigationContainer>
                  <BackButton onClick={this.handleBack} type="button">
                    <FormattedMessage {...messages[this.getBackMessageId(!this.props.filter.id)]} />
                  </BackButton>
                  <NextButton loading={isSubmitting} disabled={!dirty || !isValid || isSubmitting} type="submit">
                    <FormattedMessage {...messages.saveFilter} />
                  </NextButton>
                </NavigationContainer>
              </Form>
            );
          }}
        </Formik>
        <Modal isOpen={this.state.confirmationModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={this.handleCancelRemove}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton onClick={this.handleConfirmRemove}>
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Fragment>
    );
  }
}
