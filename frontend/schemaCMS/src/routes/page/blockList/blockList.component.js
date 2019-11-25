import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import {
  always,
  append,
  cond,
  equals,
  filter,
  ifElse,
  map,
  path,
  pipe,
  prop,
  propEq,
  reject,
  T,
  toString,
} from 'ramda';
import { Formik } from 'formik';
import { Form } from 'schemaUI';

import { BlockCounter, Container, CreateButtonContainer, Empty, Header, Link } from './blockList.styles';
import messages from './blockList.messages';
import { BackArrowButton, NavigationContainer, NextButton, PlusButton } from '../../../shared/components/navigation';
import { Loader } from '../../../shared/components/loader';
import { NoData } from '../../../shared/components/noData';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';

const { CheckboxGroup, Checkbox } = Form;

export class BlockList extends PureComponent {
  static propTypes = {
    blocks: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
    fetchBlocks: PropTypes.func.isRequired,
    fetchPage: PropTypes.func.isRequired,
    setBlocks: PropTypes.func.isRequired,
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
  };

  async componentDidMount() {
    try {
      const pageId = this.getPageId();
      await this.props.fetchPage({ pageId });
      await this.props.fetchBlocks({ pageId });
      this.setState({ loading: false });
    } catch (e) {
      this.props.history.push('/');
    }
  }

  getPageId = () => path(['match', 'params', 'pageId'], this.props);
  getDirectoryId = () => path(['page', 'directory', 'id'], this.props);

  handleCreateBlock = () => this.props.history.push(`/page/${this.getPageId()}/block/create`);
  handleShowPages = () => this.props.history.push(`/directory/${this.getDirectoryId()}`);

  handleSubmit = ({ blocks }) => {
    const pageId = this.getPageId();
    const inactive = this.props.blocks
      .filter(({ id }) => !blocks.includes(id.toString()))
      .map(({ id }) => id.toString());

    this.props.setBlocks({ pageId, active: blocks, inactive });
  };

  handleChange = ({ e, setFieldValue, blocks }) => {
    const { value, checked } = e.target;
    const setBlocks = ifElse(equals(true), always(append(value, blocks)), always(reject(equals(value), blocks)));

    setFieldValue('blocks', setBlocks(checked));
  };

  renderCheckbox = ({ id, name }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index} isEdit>
      <Link to={`/block/${id}`}>{name}</Link>
    </Checkbox>
  );

  renderList = ({ list }) => {
    const activeBlocks = pipe(
      filter(propEq('isActive', true)),
      map(prop('id')),
      map(toString)
    )(list);

    return (
      <Formik initialValues={{ blocks: activeBlocks }} onSubmit={this.handleSubmit}>
        {({ values: { blocks }, setFieldValue, submitForm, dirty }) => {
          return (
            <Fragment>
              <CheckboxGroup
                onChange={e => this.handleChange({ e, setFieldValue, blocks })}
                value={blocks}
                name="blocks"
                id="blocksCheckboxGroup"
              >
                {list.map(this.renderCheckbox)}
              </CheckboxGroup>
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

  renderContent = cond([
    [propEq('loading', true), always(<Loader />)],
    [propEq('list', []), always(<NoData />)],
    [T, this.renderList],
  ]);

  render() {
    const { blocks } = this.props;
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
          <BlockCounter>
            <FormattedMessage values={{ length: blocks.length }} {...messages.blocks} />
          </BlockCounter>
          <Empty />
        </Header>
        {this.renderContent({ loading, list: blocks })}
      </Container>
    );
  }
}
