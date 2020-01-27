import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Icons } from 'schemaUI';
import { Formik } from 'formik';
import { always, append, equals, ifElse, reject } from 'ramda';
import Helmet from 'react-helmet';

import { ButtonContainer, TagCounter, Header, Link, PlusButton } from './dataSourceTags.styles';
import messages from './dataSourceTags.messages';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { errorMessageParser, filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getDataSourceMenuOptions } from '../dataSource.constants';
import { TAGS_PAGE } from '../../../modules/dataSource/dataSource.constants';

const { PlusIcon } = Icons;
const { CheckboxGroup, Checkbox } = Form;

export class DataSourceTags extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    fetchTags: PropTypes.func.isRequired,
    setTags: PropTypes.func.isRequired,
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

      await this.props.fetchTags({ dataSourceId });
    } catch (error) {
      reportError(error);
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  handleChange = ({ e, setValues, values }) => {
    const { value, checked } = e.target;
    const setTags = ifElse(equals(true), always(append(value, values)), always(reject(equals(value), values)));

    setValues(setTags(checked));
  };

  handleSubmit = async (active, { setSubmitting, setErrors }) => {
    try {
      setSubmitting(true);
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');
      const inactive = this.props.tags
        .filter(({ id }) => !active.includes(id.toString()))
        .map(({ id }) => id.toString());

      await this.props.setTags({ dataSourceId, active, inactive });
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
    this.props.history.push(`/datasource/${dataSourceId}/${TAGS_PAGE}/add`);
  };

  renderCheckboxes = ({ id, key }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index} isEdit>
      <Link to={`/tag/${id}`}>{key}</Link>
    </Checkbox>
  );

  renderCheckboxGroup = (tags, values, setValues) =>
    renderWhenTrue(
      always(
        <CheckboxGroup
          onChange={e => this.handleChange({ e, setValues, values })}
          value={values}
          name="steps"
          id="fieldStepsCheckboxGroup"
        >
          {tags.map(this.renderCheckboxes)}
        </CheckboxGroup>
      )
    )(!!tags.length);

  renderContent = () => {
    const { tags = [] } = this.props;
    const initialValues = tags.filter(({ isActive }) => isActive).map(({ id }) => id.toString());

    return (
      <Fragment>
        <Header>
          <ButtonContainer>
            <PlusButton onClick={this.handleCreateFilter}>
              <PlusIcon />
            </PlusButton>
          </ButtonContainer>
          <TagCounter>
            <FormattedMessage values={{ tags: tags.length }} {...messages.tags} />
          </TagCounter>
        </Header>
        <Formik enableReinitialize initialValues={initialValues} onSubmit={this.handleSubmit}>
          {({ values, setValues, submitForm, dirty, isSubmitting }) => {
            if (!dirty) {
              submitForm = null;
            }

            return (
              <Fragment>
                {this.renderCheckboxGroup(tags, values, setValues)}
                <NavigationContainer right fixed padding="40px 0 70px">
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
    const { dataSource, userRole } = this.props;
    const headerTitle = dataSource.name;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const menuOptions = getDataSourceMenuOptions(dataSource.project.id);

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
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
