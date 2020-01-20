import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { always, append, equals, filter, ifElse, map, path, pipe, prop, propEq, reject, toString } from 'ramda';
import { Formik } from 'formik';
import { Form } from 'schemaUI';

import { BlockCounter, Container, CreateButtonContainer, Empty, Header, Link } from './pageBlockList.styles';
import messages from './pageBlockList.messages';
import { BackArrowButton, NavigationContainer, NextButton, PlusButton } from '../../../shared/components/navigation';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { PAGE_MENU_OPTIONS } from '../../pageBlock/pageBlock.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';

const { CheckboxGroup, Checkbox } = Form;

export class PageBlockList extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    pageBlocks: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
    fetchPageBlocks: PropTypes.func.isRequired,
    fetchPage: PropTypes.func.isRequired,
    setPageBlocks: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        pageId: PropTypes.string.isRequired,
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
      const pageId = getMatchParam(this.props, 'pageId');
      await this.props.fetchPage({ pageId });
      await this.props.fetchPageBlocks({ pageId });
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  getFolderId = () => path(['page', 'folder', 'id'], this.props);

  handleCreateBlock = () => this.props.history.push(`/page/${getMatchParam(this.props, 'pageId')}/block/create`);
  handleShowPages = () => this.props.history.push(`/folder/${this.getFolderId()}`);

  handleSubmit = async ({ blocks: active }, { setSubmitting }) => {
    try {
      const pageId = getMatchParam(this.props, 'pageId');
      const inactive = this.props.pageBlocks
        .filter(({ id }) => !active.includes(id.toString()))
        .map(({ id }) => id.toString());

      await this.props.setPageBlocks({ pageId, active, inactive });
    } catch (error) {
      this.setState({ error });
    } finally {
      setSubmitting(false);
    }
  };

  handleChange = ({ e, setFieldValue, blocks }) => {
    const { value, checked } = e.target;
    const setPageBlocks = ifElse(equals(true), always(append(value, blocks)), always(reject(equals(value), blocks)));

    setFieldValue('blocks', setPageBlocks(checked));
  };

  renderCheckbox = ({ id, name }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index} isEdit>
      <Link to={`/block/${id}`}>{name}</Link>
    </Checkbox>
  );

  renderContent = () => {
    const { pageBlocks } = this.props;
    const { loading, error } = this.state;
    const activeBlocks = pipe(
      filter(propEq('isActive', true)),
      map(prop('id')),
      map(toString)
    )(pageBlocks);

    return (
      <Formik initialValues={{ blocks: activeBlocks }} enableReinitialize onSubmit={this.handleSubmit}>
        {({ values: { blocks }, setFieldValue, submitForm, dirty, isSubmitting }) => {
          return (
            <Fragment>
              <LoadingWrapper loading={loading} error={error} noData={!pageBlocks.length} noDataContent={' '}>
                <CheckboxGroup
                  onChange={e => this.handleChange({ e, setFieldValue, blocks })}
                  value={blocks}
                  name="pageBlocks"
                  id="blocksCheckboxGroup"
                >
                  {pageBlocks.map(this.renderCheckbox)}
                </CheckboxGroup>
              </LoadingWrapper>
              <NavigationContainer fixed>
                <BackArrowButton type="button" onClick={this.handleShowPages} />
                <NextButton type="submit" onClick={submitForm} loading={isSubmitting} disabled={!dirty || isSubmitting}>
                  <FormattedMessage {...messages.save} />
                </NextButton>
              </NavigationContainer>
            </Fragment>
          );
        }}
      </Formik>
    );
  };

  renderBlockCounter = (loading, error, count) =>
    renderWhenTrue(
      always(
        <BlockCounter>
          <FormattedMessage values={{ count }} {...messages.blocks} />
        </BlockCounter>
      )
    )(!loading & !error);

  render() {
    const { error, loading } = this.state;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(PAGE_MENU_OPTIONS, this.props.userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Header>
          <CreateButtonContainer>
            <PlusButton onClick={this.handleCreateBlock} />
          </CreateButtonContainer>
          {this.renderBlockCounter(loading, error, this.props.pageBlocks.length)}
          <Empty />
        </Header>
        {this.renderContent()}
      </Container>
    );
  }
}
