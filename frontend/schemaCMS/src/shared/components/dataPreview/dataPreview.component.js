import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icons } from 'schemaUI';
import { isEmpty } from 'ramda';

import { Loader } from '../loader';
import { Table } from '../table';
import { FieldDetail } from '../fieldDetail';
import messages from './dataPreview.messages';
import {
  arrowStyles,
  buttonStyles,
  Container,
  Content,
  Navigation,
  NavigationButton,
  NavigationLabel,
} from './dataPreview.styles';
import { getTableData } from '../../utils/helpers';

const INITIAL_STEP = 0;

export default class DataPreview extends PureComponent {
  static propTypes = {
    previewData: PropTypes.object.isRequired,
    fetchPreview: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    dataSource: PropTypes.object,
    history: PropTypes.object.isRequired,
    jobId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  static defaultProps = {
    dataSource: {},
    jobId: null,
  };

  static getDerivedStateFromProps({ previewData }, { step }) {
    const { fields = {} } = previewData;

    if (!isEmpty(fields)) {
      const fieldsIds = Object.keys(fields);

      return {
        step,
        countFields: fieldsIds.length,
        fieldsIds: [null, ...fieldsIds],
      };
    }

    return null;
  }

  state = {
    loading: true,
    step: INITIAL_STEP,
  };

  async componentDidMount() {
    const { dataSource, jobId } = this.props;
    const { id: dataSourceId } = dataSource;
    try {
      await this.props.fetchPreview({ dataSourceId, jobId });
      this.setState({ loading: false });
    } catch (e) {
      this.props.history.push('/');
    }
  }

  getFieldDetailsData() {
    const { step, fieldsIds } = this.state;
    const id = fieldsIds[step];
    const data = this.props.previewData.fields[id];

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
    const tableData = getTableData(this.props.previewData.data);
    const content = step ? this.renderFieldDetails(this.getFieldDetailsData()) : this.renderTable(tableData);

    return (
      <Content>
        {this.renderNavigation()}
        {content}
      </Content>
    );
  }

  render() {
    const content = this.state.loading ? <Loader /> : this.renderContent();

    return <Container>{content}</Container>;
  }
}
