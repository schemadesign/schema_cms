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
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { renderWhenTrue } from '../../../shared/utils/rendering';

const { CheckboxGroup, Checkbox } = Form;

export class PageBlockList extends PureComponent {
  static propTypes = {
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
      const pageId = this.getPageId();
      await this.props.fetchPage({ pageId });
      await this.props.fetchPageBlocks({ pageId });
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  }

  getPageId = () => path(['match', 'params', 'pageId'], this.props);
  getDirectoryId = () => path(['page', 'directory', 'id'], this.props);

  handleCreateBlock = () => this.props.history.push(`/page/${this.getPageId()}/block/create`);
  handleShowPages = () => this.props.history.push(`/directory/${this.getDirectoryId()}`);

  handleSubmit = ({ pageBlocks }) => {
    const pageId = this.getPageId();
    const inactive = this.props.pageBlocks
      .filter(({ id }) => !pageBlocks.includes(id.toString()))
      .map(({ id }) => id.toString());

    this.props.setPageBlocks({ pageId, active: pageBlocks, inactive });
  };

  handleChange = ({ e, setFieldValue, pageBlocks }) => {
    const { value, checked } = e.target;
    const setPageBlocks = ifElse(
      equals(true),
      always(append(value, pageBlocks)),
      always(reject(equals(value), pageBlocks))
    );

    setFieldValue('pageBlocks', setPageBlocks(checked));
  };

  renderCheckbox = ({ id, name }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index} isEdit>
      <Link to={`/block/${id}`}>{name}</Link>
    </Checkbox>
  );

  renderContent = () => {
    const { pageBlocks: list } = this.props;
    const { loading, error } = this.state;

    const activeBlocks = pipe(
      filter(propEq('isActive', true)),
      map(prop('id')),
      map(toString)
    )(list);

    return (
      <Formik initialValues={{ pageBlocks: activeBlocks }} onSubmit={this.handleSubmit}>
        {({ values: { pageBlocks }, setFieldValue, submitForm, dirty }) => {
          return (
            <Fragment>
              <LoadingWrapper loading={loading} error={error} noData={!list.length}>
                <CheckboxGroup
                  onChange={e => this.handleChange({ e, setFieldValue, pageBlocks })}
                  value={pageBlocks}
                  name="pageBlocks"
                  id="blocksCheckboxGroup"
                >
                  {list.map(this.renderCheckbox)}
                </CheckboxGroup>
              </LoadingWrapper>
              <NavigationContainer>
                <BackArrowButton type="button" onClick={this.handleShowPages} />
                <NextButton type="submit" onClick={submitForm} disabled={!dirty}>
                  <FormattedMessage {...messages.save} />
                </NextButton>
              </NavigationContainer>
            </Fragment>
          );
        }}
      </Formik>
    );
  };

  renderBlockCounter = renderWhenTrue(
    always(
      <BlockCounter>
        <FormattedMessage values={{ length: this.props.pageBlocks.length }} {...messages.blocks} />
      </BlockCounter>
    )
  );

  render() {
    const { loading } = this.state;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Header>
          <CreateButtonContainer>
            <PlusButton onClick={this.handleCreateBlock} />
          </CreateButtonContainer>
          {this.renderBlockCounter(!loading)}
          <Empty />
        </Header>
        {this.renderContent()}
      </Container>
    );
  }
}
