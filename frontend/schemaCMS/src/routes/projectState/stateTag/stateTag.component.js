import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { append, ifElse, equals, always, reject, map } from 'ramda';
import { Stepper, Form as FormUI } from 'schemaUI';

import { Form, TagList } from './stateTag.styles';
import messages from './stateTag.messages';
import { getProjectMenuOptions, PROJECT_STATE_ID } from '../../project/project.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { contentStyles, NavigationButtons } from '../../project/createProjectState/createProjectState.styles';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import reportError from '../../../shared/utils/reportError';

const { CheckboxGroup, Checkbox, Label } = FormUI;

export class StateTag extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    setValues: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    tags: PropTypes.array.isRequired,
    values: PropTypes.array.isRequired,
    fetchTags: PropTypes.func.isRequired,
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

      await this.props.fetchTags({ dataSourceId });
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleBack = () => this.props.history.push(`/state/${this.props.state.id}/edit`);

  handleChange = e => {
    const { value, checked } = e.target;
    const { setValues, values } = this.props;
    const intValue = parseInt(value, 10);
    const setTags = ifElse(equals(true), always(append(intValue, values)), always(reject(equals(intValue), values)));

    setValues(setTags(checked));
  };

  renderTags = ({ id, value }, index) => (
    <Checkbox key={index} id={`checkbox-${id}`} value={id}>
      {value}
    </Checkbox>
  );

  renderList = ({ name, tags, id }) => (
    <TagList key={id}>
      <Label>{name}</Label>
      <CheckboxGroup
        onChange={this.handleChange}
        name={name}
        value={this.props.values}
        customStyles={{ borderTop: 'none' }}
      >
        {tags.map(this.renderTags)}
      </CheckboxGroup>
    </TagList>
  );

  renderTagsList = map(this.renderList);

  render() {
    const { userRole, handleSubmit, isSubmitting, isValid, state, tags } = this.props;
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
            {this.renderTagsList(tags)}
          </LoadingWrapper>
          <NavigationContainer fixed contentStyles={contentStyles}>
            <NavigationButtons>
              <BackButton type="button" onClick={this.handleBack} />
              <NextButton type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid} />
            </NavigationButtons>
            <Stepper steps={3} activeStep={2} />
          </NavigationContainer>
        </Form>
      </Fragment>
    );
  }
}
