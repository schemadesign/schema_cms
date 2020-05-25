import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { append, ifElse, equals, always, reject, map } from 'ramda';
import { Stepper, Form as FormUI } from 'schemaUI';

import { TagList } from './stateTag.styles';
import messages from './stateTag.messages';
import { getProjectMenuOptions, PROJECT_STATE_ID } from '../../project/project.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { contentStyles, NavigationButtons } from '../../../shared/components/navigationStyles';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import reportError from '../../../shared/utils/reportError';

const { CheckboxGroup, Checkbox, Label } = FormUI;

export class StateTag extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    setValues: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    tags: PropTypes.array.isRequired,
    values: PropTypes.array.isRequired,
    project: PropTypes.object.isRequired,
    fetchTagCategories: PropTypes.func.isRequired,
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
      const projectId = this.props.project.id;

      await this.props.fetchTagCategories({ projectId });
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

  handleSubmit = e => {
    const { dirty, handleSubmit, history, state } = this.props;
    const redirectUrl = `/state/${state.id}/filters`;

    if (dirty) {
      return handleSubmit(e);
    }

    return history.push(redirectUrl);
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
    const { userRole, isSubmitting, state, tags } = this.props;
    const { loading, error } = this.state;
    const projectId = state.project;
    const menuOptions = getProjectMenuOptions(projectId);
    const title = state.name;
    const noData = <FormattedMessage {...messages.noData} />;

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
        <LoadingWrapper loading={loading} error={error} noData={!tags.length} noDataContent={noData}>
          {this.renderTagsList(tags)}
        </LoadingWrapper>
        <NavigationContainer fixed contentStyles={contentStyles}>
          <NavigationButtons>
            <BackButton type="button" onClick={this.handleBack} disabled={loading} />
            <NextButton
              type="submit"
              onClick={this.handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || loading}
            />
          </NavigationButtons>
          <Stepper steps={3} activeStep={2} />
        </NavigationContainer>
      </Fragment>
    );
  }
}
