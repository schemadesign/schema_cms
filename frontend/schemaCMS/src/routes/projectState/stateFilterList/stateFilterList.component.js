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

const { CheckboxGroup, Checkbox } = FormUI;

export class StateFilterList extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    setValues: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
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
    const { setValues, values } = this.props;
    const intValue = parseInt(value, 10);
    const setTags = ifElse(equals(true), always(append(intValue, values)), always(reject(equals(intValue), values)));

    setValues(setTags(checked));
  };

  handleBack = () => this.props.history.push(`/state/${this.props.state.id}/tags`);

  renderFilters = ({ id, name }, index) => (
    <Checkbox key={index} id={`checkbox-${index}`} value={id}>
      {name}
    </Checkbox>
  );

  render() {
    const { userRole, handleSubmit, isSubmitting, isValid, state, filters, values } = this.props;
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
        <Form onSubmit={handleSubmit}>
          <LoadingWrapper loading={loading} error={error}>
            <CheckboxGroup onChange={this.handleChange} name={PROJECT_STATE_FILTERS} value={values}>
              {filters.map(this.renderFilters)}
            </CheckboxGroup>
          </LoadingWrapper>
          <NavigationContainer fixed contentStyles={contentStyles}>
            <NavigationButtons>
              <BackButton type="button" onClick={this.handleBack} />
              <NextButton type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid} />
            </NavigationButtons>
            <Stepper steps={3} activeStep={3} />
          </NavigationContainer>
        </Form>
      </Fragment>
    );
  }
}
