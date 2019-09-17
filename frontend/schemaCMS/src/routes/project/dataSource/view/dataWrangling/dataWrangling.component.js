import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Button, Form, Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { Container, Header, StepCounter, Empty, ButtonContainer, Link } from './dataWrangling.styles';
import messages from './dataWrangling.messages';

const { CheckboxGroup, Checkbox } = Form;
const { UploadIcon } = Icons;

export class DataWrangling extends PureComponent {
  static propTypes = {
    dataWrangling: PropTypes.array.isRequired,
    bindSubmitForm: PropTypes.func.isRequired,
    fetchDataWrangling: PropTypes.func.isRequired,
    uploadScript: PropTypes.func.isRequired,
    sendUpdatedDataWrangling: PropTypes.func.isRequired,
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const { dataSourceId } = this.props.match.params;
    this.props.fetchDataWrangling({ dataSourceId });
  }

  getScrtiptUrl = index => {
    const baseUrl = this.props.match.url.replace(/\d+\/?$/, 'script/view/');

    return `${baseUrl}${index}`;
  };

  renderCheckboxes = values =>
    values.map(({ name }, index) => (
      <Checkbox id={index} value={name} key={index} isEdit>
        <Link to={this.getScrtiptUrl(index)}>{name}</Link>
      </Checkbox>
    ));

  render() {
    const { bindSubmitForm, dataWrangling } = this.props;
    const data = dataWrangling.reduce((data, { name, active }) => ({ ...data, [name]: active }), {});
    const stepCopyKey = dataWrangling.length < 2 ? 'steps' : 'step';

    return (
      <Container>
        <Header>
          <Empty />
          <StepCounter>
            <FormattedMessage values={{ length: dataWrangling.length }} {...messages[stepCopyKey]} />
          </StepCounter>
          <ButtonContainer>
            <Button>
              <UploadIcon />
            </Button>
          </ButtonContainer>
        </Header>
        <Formik initialValues={data}>
          {({ handleChange, values, submitForm, dirty, isValid }) => {
            if (dirty && isValid) {
              bindSubmitForm(submitForm);
            }
            return (
              <CheckboxGroup onChange={handleChange} value={values}>
                {this.renderCheckboxes(dataWrangling)}
              </CheckboxGroup>
            );
          }}
        </Formik>
      </Container>
    );
  }
}
