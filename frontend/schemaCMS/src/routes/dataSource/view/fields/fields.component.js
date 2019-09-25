import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Button, Icons } from 'schemaUI';
import { isEmpty } from 'ramda';

import { Loader } from '../../../../shared/components/loader';
import { Table } from '../../../../shared/components/table';
import { Details } from './details';
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
    const { projectId, dataSourceId } = this.props.match.params;

    this.props.fetchFields({ projectId, dataSourceId });
  }

  componentWillUnmount() {
    this.props.unmountFields();
  }

  prepareTableData() {
    const columnsIds = Object.keys(this.props.fields);
    const rows = [];

    this.props.previewTable.forEach(data => {
      const row = [];

      columnsIds.forEach(name => {
        row.push(data[name] || '');
      });

      rows.push(row);
    });

    return {
      header: columnsIds,
      rows,
      numberedRows: true,
    };
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

  renderTable = () => <Table {...this.prepareTableData()} />;

  renderFieldDetails() {
    const { step, fieldsIds } = this.state;
    const id = fieldsIds[step];
    const fieldData = this.props.fields[id];

    return <Details id={id} data={fieldData} intl={this.props.intl} />;
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
    const content = this.state.isLoading ? <Loader /> : this.renderContent();

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        {content}
      </Container>
    );
  }
}
