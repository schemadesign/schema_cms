import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Button, Icons } from 'schemaUI';
import { isEmpty } from 'ramda';

import { Loader } from '../../../../../shared/components/loader';
import { PreviewTable } from './previewTable';
import messages from './fields.messages';
import {
  Container,
  Navigation,
  NavigationLabel,
  NavigationButton,
  Content,
  buttonStyles,
  arrowStyles,
} from './fields.styles';

const INITIAL_STEP = 0;

export class Fields extends PureComponent {
  static propTypes = {
    fields: PropTypes.object,
    previewTable: PropTypes.array,
    fetchFields: PropTypes.func.isRequired,
    unmountFields: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    step: INITIAL_STEP,
    countFields: INITIAL_STEP,
  };

  componentDidMount() {
    const { projectId, dataSourceId } = this.props.match.params;

    this.props.fetchFields({ projectId, dataSourceId });
    this.updateCount();
  }

  componentDidUpdate() {
    this.updateCount();
  }

  componentWillUnmount() {
    this.props.unmountFields();
  }

  isLoading = () => isEmpty(this.props.fields);

  updateCount = () => {
    this.setState((state, props) => ({
      countFields: Object.keys(props.fields).length,
    }));
  };

  handleNavigation = direction => {
    const { step, countFields } = this.state;
    const updatedStep = step + direction;

    if (updatedStep >= INITIAL_STEP && updatedStep <= countFields) {
      this.setState({
        step: updatedStep,
      });
    }
  };

  handlePreviewStep = () => this.handleNavigation(-1);

  handleNextStep = () => this.handleNavigation(1);

  renderNavigation() {
    const { step, countFields } = this.state;
    const { intl } = this.props;

    const label = step
      ? intl.formatMessage(messages.ofFields, { step, countFields })
      : intl.formatMessage(messages.fields, { countFields });

    const isPreviousDisabled = step === INITIAL_STEP;
    const isNextDisabled = step === countFields;

    return (
      <Navigation>
        <NavigationButton>
          <Button onClick={this.handlePreviewStep} disabled={isPreviousDisabled} customStyles={buttonStyles}>
            <Icons.ArrowLeftIcon customStyles={arrowStyles(isPreviousDisabled)} />
          </Button>
        </NavigationButton>
        <NavigationLabel>{label}</NavigationLabel>
        <NavigationButton>
          <Button onClick={this.handleNextStep} disabled={isNextDisabled} customStyles={buttonStyles}>
            <Icons.ArrowRightIcon customStyles={arrowStyles(isNextDisabled)} />
          </Button>
        </NavigationButton>
      </Navigation>
    );
  }

  renderTable() {
    const { fields, previewTable } = this.props;

    return <PreviewTable fields={fields} data={previewTable} />;
  }

  renderFieldDetails() {
    return <Content>{this.state.step} Field data</Content>;
  }

  renderContent() {
    const { step } = this.state;

    const navigation = this.renderNavigation();
    const content = step ? this.renderFieldDetails() : this.renderTable();

    return (
      <Content>
        {navigation}
        {content}
      </Content>
    );
  }

  render() {
    const content = this.isLoading() ? <Loader /> : this.renderContent();

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        {content}
      </Container>
    );
  }
}
