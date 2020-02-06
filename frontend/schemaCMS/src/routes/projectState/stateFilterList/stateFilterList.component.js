import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form as FormUI, Stepper } from 'schemaUI';
import Helmet from 'react-helmet';
import { always, append, equals, ifElse, reject } from 'ramda';

import { Form } from './stateFilterList.styles';
import messages from './stateFilterList.messages';
import reportError from '../../../shared/utils/reportError';
import { getProjectMenuOptions, PROJECT_STATE_ID } from '../../project/project.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { contentStyles, NavigationButtons } from '../../project/createProjectState/createProjectState.styles';
import { PROJECT_STATE_FILTERS } from '../../../modules/projectState/projectState.constants';
import { Link } from '../../page/pageBlockList/pageBlockList.styles';

const { CheckboxGroup, Checkbox } = FormUI;

export class StateFilterList extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    setValues: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired,
    values: PropTypes.array.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
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
      const dataSourceId = this.props.state.datasource;

      await this.props.fetchFilters({ dataSourceId });
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleChange = e => {
    const { value, checked } = e.target;
    const { setValues, values, state } = this.props;
    const intValue = parseInt(value, 10);
    const isFilled = state.filters.find(({ filter }) => filter === intValue);

    if (checked && !isFilled) {
      return this.props.history.push(`/state/${this.props.state.id}/filter/${value}`);
    }

    const setTags = ifElse(equals(true), always(append(intValue, values)), always(reject(equals(intValue), values)));

    return setValues(setTags(checked));
  };

  handleBack = () => this.props.history.push(`/state/${this.props.state.id}/tags`);

  handleSubmit = e => {
    const { dirty, handleSubmit, history, state } = this.props;
    const redirectUrl = `/project/${state.project}/state`;

    if (dirty) {
      return handleSubmit(e);
    }

    return history.push(redirectUrl);
  };

  renderFilters = ({ id, name }, index) => (
    <Checkbox key={index} id={`checkbox-${index}`} value={id}>
      <Link to={`/state/${this.props.state.id}/filter/${id}`} onClick={this.handleGoToBlock}>
        {name}
      </Link>
    </Checkbox>
  );

  render() {
    const { userRole, isSubmitting, state, filters, values } = this.props;
    const { loading, error } = this.state;
    const projectId = state.project;
    const menuOptions = getProjectMenuOptions(projectId);
    const title = state.name;

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
        <Form onSubmit={this.handleSubmit}>
          <LoadingWrapper loading={loading} error={error}>
            <CheckboxGroup onChange={this.handleChange} name={PROJECT_STATE_FILTERS} value={values}>
              {filters.map(this.renderFilters)}
            </CheckboxGroup>
          </LoadingWrapper>
          <NavigationContainer fixed contentStyles={contentStyles}>
            <NavigationButtons>
              <BackButton type="button" onClick={this.handleBack} />
              <NextButton type="submit" loading={isSubmitting} disabled={isSubmitting}>
                <FormattedMessage {...messages.finish} />
              </NextButton>
            </NavigationButtons>
            <Stepper steps={3} activeStep={3} />
          </NavigationContainer>
        </Form>
      </Fragment>
    );
  }
}
