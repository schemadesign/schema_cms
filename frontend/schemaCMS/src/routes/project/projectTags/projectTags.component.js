import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form } from 'schemaUI';
import { Formik } from 'formik';
import { always, append, equals, ifElse, reject } from 'ramda';
import Helmet from 'react-helmet';

import { Link } from './projectTags.styles';
import messages from './projectTags.messages';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackArrowButton, NavigationContainer, NextButton, PlusButton } from '../../../shared/components/navigation';
import { errorMessageParser, filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { TAGS_PAGE } from '../../../modules/project/project.constants';
import { getProjectMenuOptions, PROJECT_TAGS_ID } from '../project.constants';
import { TAGS } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { CounterHeader } from '../../../shared/components/counterHeader';

const { CheckboxGroup, Checkbox } = Form;

export class ProjectTags extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    fetchTags: PropTypes.func.isRequired,
    setTags: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
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
      const projectId = getMatchParam(this.props, 'projectId');

      await this.props.fetchTags({ projectId });
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
      const projectId = getMatchParam(this.props, 'projectId');
      const inactive = this.props.tags
        .filter(({ id }) => !active.includes(id.toString()))
        .map(({ id }) => id.toString());

      await this.props.setTags({ projectId, active, inactive });
    } catch (error) {
      const { formatMessage } = this.props.intl;
      const errorMessages = errorMessageParser({ errors, messages, formatMessage });

      setErrors(errorMessages);
    } finally {
      setSubmitting(false);
    }
  };

  handleCreateTag = () => {
    const projectId = getMatchParam(this.props, 'projectId');
    this.props.history.push(`/project/${projectId}/${TAGS_PAGE}/create`);
  };

  handleShowProject = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}`);

  renderCheckboxes = ({ id, name }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index} isEdit>
      <Link to={`/tag/${id}`}>{name}</Link>
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
    const { tags = [], intl } = this.props;
    const initialValues = tags.filter(({ isActive }) => isActive).map(({ id }) => id.toString());

    return (
      <Fragment>
        <CounterHeader copy={intl.formatMessage(messages.tags)} count={tags.length} />
        <Formik enableReinitialize initialValues={initialValues} onSubmit={this.handleSubmit}>
          {({ values, setValues, submitForm, dirty, isSubmitting }) => {
            if (!dirty) {
              submitForm = null;
            }

            return (
              <Fragment>
                {this.renderCheckboxGroup(tags, values, setValues)}
                <NavigationContainer fixed>
                  <BackArrowButton id="backBtn" hideOnDesktop onClick={this.handleShowProject} />
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
    const { project, userRole, match } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const menuOptions = getProjectMenuOptions(project.id);

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
          active={PROJECT_TAGS_ID}
        />
        <ProjectTabs active={TAGS} url={`/project/${match.params.projectId}`} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <PlusButton onClick={this.handleCreateTag} />
        </ContextHeader>
        <LoadingWrapper loading={loading} error={error}>
          {this.renderContent()}
        </LoadingWrapper>
      </Fragment>
    );
  }
}
