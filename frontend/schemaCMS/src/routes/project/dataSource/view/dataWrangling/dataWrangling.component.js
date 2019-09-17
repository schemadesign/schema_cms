import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Form } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { always } from 'ramda';

import { Container, Header, StepCounter, Empty, ButtonContainer, Link } from './dataWrangling.styles';
import messages from './dataWrangling.messages';
import { renderWhenTrue } from '../../../../../shared/utils/rendering';

const { CheckboxGroup, Checkbox, FileUpload } = Form;

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

  state = {
    uploading: false,
    errorOnUploading: false,
  };

  componentDidMount() {
    const { dataSourceId } = this.props.match.params;
    this.props.fetchDataWrangling({ dataSourceId });
  }

  getScrtiptUrl = index => {
    const baseUrl = this.props.match.url.replace(/\d+\/?$/, 'script/view/');

    return `${baseUrl}${index}`;
  };

  handleUploadScript = async ({
    currentTarget: {
      files: [file],
    },
  }) => {
    if (!file) {
      return;
    }

    try {
      const { dataSourceId } = this.props.match.params;
      this.setState({ uploading: true, errorOnUploading: false });

      await this.props.uploadScript({ file, dataSourceId });

      await this.props.uploadScript({ file, dataSourceId });
    } catch (e) {
      this.setState({ uploading: false, errorOnUploading: true });
    }
  };

  renderCheckboxes = values =>
    values.map(({ name }, index) => (
      <Checkbox id={index} value={name} key={index} isEdit>
        <Link to={this.getScrtiptUrl(index)}>{name}</Link>
      </Checkbox>
    ));

  renderErrorOnUploading = renderWhenTrue(
    always(
      <Error>
        <FormattedMessage {...messages.errorOnUploading} />
      </Error>
    )
  );

  render() {
    const { bindSubmitForm, dataWrangling, sendUpdatedDataWrangling } = this.props;
    const { uploading, errorOnUploading } = this.state;
    const data = dataWrangling.reduce((data, { name, active }) => ({ ...data, [name]: active }), {});
    const stepCopyKey = dataWrangling.length < 2 ? 'steps' : 'step';

    return (
      <Container>
        <Header>
          <Empty />
          <StepCounter>
            <FormattedMessage values={{ length: dataWrangling.length }} {...messages[stepCopyKey]} />
            {this.renderErrorOnUploading(errorOnUploading)}
          </StepCounter>
          <UploadContainer>
            <FileUpload
              type="file"
              id="fileUpload"
              onChange={this.handleUploadScript}
              accept=".py"
              disabled={uploading}
            />
          </UploadContainer>
        </Header>
        <Formik initialValues={data} onSubmit={sendUpdatedDataWrangling}>
          {({ handleChange, values, submitForm, dirty, isValid }) => {
            if (dirty && isValid && !uploading) {
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
