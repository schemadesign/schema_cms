import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Icons } from 'schemaUI';
import { Formik } from 'formik';
import { always, append, equals, ifElse, reject } from 'ramda';
import Helmet from 'react-helmet';

import { ButtonContainer, FilterCounter, Header, Link, PlusButton } from './filters.styles';
import messages from './filters.messages';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';

const { PlusIcon } = Icons;
const { CheckboxGroup, Checkbox } = Form;

export class Filters extends PureComponent {
  static propTypes = {
    filters: PropTypes.array.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    dataSource: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');

      await this.props.fetchFilters({ dataSourceId });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  handleChange = ({ e, setValues, values }) => {
    const { value, checked } = e.target;
    const setFilters = ifElse(equals(true), always(append(value, values)), always(reject(equals(value), values)));

    setValues(setFilters(checked));
  };

  handleSubmit = async (active, { setSubmitting, setErrors }) => {
    try {
      setSubmitting(true);
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');
      const inactive = this.props.filters
        .filter(({ id }) => !active.includes(id.toString()))
        .map(({ id }) => id.toString());

      await this.props.setFilters({ dataSourceId, active, inactive });
    } catch (error) {
      const { formatMessage } = this.props.intl;
      const errorMessages = errorMessageParser({ errors, messages, formatMessage });

      setErrors(errorMessages);
    } finally {
      setSubmitting(false);
    }
  };

  handleCreateFilter = () => {
    const dataSourceId = getMatchParam(this.props, 'dataSourceId');
    this.props.history.push(`/datasource/${dataSourceId}/filters/add`);
  };

  renderCheckboxes = ({ id, name }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index} isEdit>
      <Link to={`/filter/${id}`}>{name}</Link>
    </Checkbox>
  );

  renderContent = () => {
    const { filters = [] } = this.props;
    const initialValues = filters.filter(({ isActive }) => isActive).map(({ id }) => id.toString());

    return (
      <Fragment>
        <Header>
          <ButtonContainer>
            <PlusButton onClick={this.handleCreateFilter}>
              <PlusIcon />
            </PlusButton>
          </ButtonContainer>
          <FilterCounter>
            <FormattedMessage values={{ length: filters.length }} {...messages.filters} />
          </FilterCounter>
        </Header>
        <Formik enableReinitialize initialValues={initialValues} onSubmit={this.handleSubmit}>
          {({ values, setValues, submitForm, dirty, isSubmitting }) => {
            if (!dirty) {
              submitForm = null;
            }

            return (
              <Fragment>
                <CheckboxGroup
                  onChange={e => this.handleChange({ e, setValues, values })}
                  value={values}
                  name="steps"
                  id="fieldStepsCheckboxGroup"
                >
                  {filters.map(this.renderCheckboxes)}
                </CheckboxGroup>
                <NavigationContainer right>
                  <NextButton onClick={submitForm} loading={isSubmitting} disabled={!dirty || isSubmitting}>
                    <FormattedMessage {...messages.save} />
                  </NextButton>
                </NavigationContainer>
              </Fragment>
            );
          }}
        </Formik>
      </Fragment>
    );
  };

  render() {
    const { loading, error } = this.state;
    const headerTitle = this.props.dataSource.name;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <DataSourceNavigation {...this.props} />
        </ContextHeader>
        <LoadingWrapper loading={loading} error={error}>
          {this.renderContent()}
        </LoadingWrapper>
        <DataSourceNavigation {...this.props} hideOnDesktop />
      </Fragment>
    );
  }
}
