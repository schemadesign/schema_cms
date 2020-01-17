import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { always, filter, isEmpty, map, path, pathOr, pipe, prop, propEq, toString } from 'ramda';
import { Form, Icons } from 'schemaUI';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { DndProvider } from 'react-dnd';
import { asMutable } from 'seamless-immutable';

import {
  BlockCounter,
  CheckboxContent,
  checkboxStyles,
  Container,
  CreateButtonContainer,
  Empty,
  Header,
  IconWrapper,
  Link,
} from './pageBlockList.styles';
import messages from './pageBlockList.messages';
import { BackArrowButton, NavigationContainer, NextButton, PlusButton } from '../../../shared/components/navigation';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { getMatchParam } from '../../../shared/utils/helpers';
import { Draggable } from '../../../shared/components/draggable';
import reportError from '../../../shared/utils/reportError';

const { CheckboxGroup, Checkbox } = Form;
const { MenuIcon } = Icons;

export class PageBlockList extends PureComponent {
  static propTypes = {
    values: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
    temporaryPageBlocks: PropTypes.array.isRequired,
    saveTemporaryBlocks: PropTypes.func.isRequired,
    fetchPageBlocks: PropTypes.func.isRequired,
    fetchPage: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    setValues: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
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
      const { temporaryPageBlocks, fetchPage, fetchPageBlocks, values, setValues } = this.props;
      const fromBlock = pathOr(false, ['history', 'location', 'state', 'fromBlock'], this.props);
      const pageId = getMatchParam(this.props, 'pageId');
      await fetchPage({ pageId });
      await fetchPageBlocks({ pageId });
      if (fromBlock && !isEmpty(values) && !isEmpty(temporaryPageBlocks)) {
        setValues(temporaryPageBlocks);
        this.props.saveTemporaryBlocks([]);
      }
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  getFolderId = () => path(['page', 'folder', 'id'], this.props);

  handleCreateBlock = () => {
    const { dirty, saveTemporaryBlocks, values, history } = this.props;
    if (dirty) {
      saveTemporaryBlocks(values);
    }
    history.push(`/page/${getMatchParam(this.props, 'pageId')}/block/create`);
  };
  handleShowPages = () => this.props.history.push(`/folder/${this.getFolderId()}`);

  handleChange = e => {
    const { value, checked } = e.target;
    const { setValues, values } = this.props;
    const blocks = values.map(block => (block.id.toString() === value ? { ...block, isActive: checked } : block));

    setValues(blocks);
  };

  handleMove = (dragIndex, hoverIndex) => {
    const { values, setValues } = this.props;
    const dragCard = values[dragIndex];
    const mutableValues = asMutable(values);

    mutableValues.splice(dragIndex, 1);
    mutableValues.splice(hoverIndex, 0, dragCard);

    setValues(mutableValues);
  };

  handleGoToBlock = () => {
    if (this.props.dirty) {
      this.props.saveTemporaryBlocks(this.props.values);
    }
  };

  renderCheckbox = ({ id, name }, index) => (
    <Draggable key={id} accept="CHECKBOX" onMove={this.handleMove} id={id} index={index}>
      {makeDraggable => {
        const draggableIcon = makeDraggable(
          <IconWrapper>
            <MenuIcon />
          </IconWrapper>
        );

        return (
          <Checkbox id={`checkbox-${index}`} value={id.toString()} isEdit>
            <CheckboxContent>
              {draggableIcon}
              <Link to={`/block/${id}`} onClick={this.handleGoToBlock}>
                {name}
              </Link>
            </CheckboxContent>
          </Checkbox>
        );
      }}
    </Draggable>
  );

  renderContent = () => {
    const { handleSubmit, values, isSubmitting, dirty } = this.props;
    const { loading, error } = this.state;
    const blocks = pipe(
      filter(propEq('isActive', true)),
      map(prop('id')),
      map(toString)
    )(values);

    return (
      <form onSubmit={handleSubmit}>
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          <LoadingWrapper loading={loading} error={error} noData={!values.length} noDataContent={' '}>
            <CheckboxGroup
              onChange={this.handleChange}
              value={blocks}
              name="pageBlocks"
              id="blocksCheckboxGroup"
              customCheckboxStyles={checkboxStyles}
            >
              {values.map(this.renderCheckbox)}
            </CheckboxGroup>
          </LoadingWrapper>
          <NavigationContainer fixed>
            <BackArrowButton type="button" onClick={this.handleShowPages} />
            <NextButton type="submit" loading={isSubmitting} disabled={!dirty || isSubmitting}>
              <FormattedMessage {...messages.save} />
            </NextButton>
          </NavigationContainer>
        </DndProvider>
      </form>
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
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Header>
          <CreateButtonContainer>
            <PlusButton onClick={this.handleCreateBlock} />
          </CreateButtonContainer>
          {this.renderBlockCounter(loading, error, this.props.values.length)}
          <Empty />
        </Header>
        {this.renderContent()}
      </Container>
    );
  }
}
