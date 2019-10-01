import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Button, Icons } from 'schemaUI';
import { isEmpty, keys, map } from 'ramda';

import { Loader } from '../loader';
import { Table } from '../table';
import { FieldDetail } from '../fieldDetail';
import messages from './dataPreview.messages';
import {
  Container,
  Navigation,
  NavigationLabel,
  NavigationButton,
  Content,
  buttonStyles,
  arrowStyles,
} from './dataPreview.styles';
import { StepNavigation } from '../stepNavigation';

const INITIAL_STEP = 0;

export default class DataPreview extends PureComponent {
  static propTypes = {
    fields: PropTypes.object,
    previewTable: PropTypes.array,
    fetchFields: PropTypes.func.isRequired,
    unmountFields: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    dataSource: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps({ fields }, { isLoading, step }) {
    if (isLoading && !isEmpty(fields)) {
      const fieldsIds = Object.keys(fields);

      return {
        step,
        isLoading: false,
        countFields: fieldsIds.length,
        fieldsIds: [null, ...fieldsIds],
      };
    }

    return null;
  }

  state = {
    isLoading: true,
    step: INITIAL_STEP,
  };

  componentDidMount() {
    const { id: dataSourceId } = this.props.dataSource;

    this.props.fetchFields({ dataSourceId });
  }

  componentWillUnmount() {
    this.props.unmountFields();
  }

  getTableData() {
    const columnsIds = keys(this.props.fields);
    const rows = map(data => map(name => data[name] || '', columnsIds), this.props.previewTable);

    return { header: columnsIds, rows };
  }

  getFieldDetailsData() {
    const { step, fieldsIds } = this.state;
    const id = fieldsIds[step];
    const data = this.props.fields[id];

    return { id, data, intl: this.props.intl };
  }

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

  renderTable = props => <Table {...props} numberedRows />;

  renderFieldDetails = props => <FieldDetail {...props} />;

  renderContent() {
    const { step } = this.state;
    const content = step ? this.renderFieldDetails(this.getFieldDetailsData()) : this.renderTable(this.getTableData());

    return (
      <Content>
        {this.renderNavigation()}
        {content}
      </Content>
    );
  }

  render() {
    const content = this.state.isLoading ? <Loader /> : this.renderContent();

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        {content}
        <StepNavigation {...this.props} />
      </Container>
    );
  }
}
