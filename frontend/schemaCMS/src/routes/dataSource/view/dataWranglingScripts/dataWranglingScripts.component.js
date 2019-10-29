import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Form } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { always, append, equals, ifElse, pathOr, reject, map, pipe, prop, toString } from 'ramda';

import { Container, Empty, Error, Header, Link, StepCounter, UploadContainer } from './dataWranglingScripts.styles';
import messages from './dataWranglingScripts.messages';
import { renderWhenTrue } from '../../../../shared/utils/rendering';
import { StepNavigation } from '../../../../shared/components/stepNavigation';

const { CheckboxGroup, Checkbox, FileUpload } = Form;

export class DataWranglingScripts extends PureComponent {
  static propTypes = {
    dataWranglingScripts: PropTypes.array.isRequired,
    fetchDataWranglingScripts: PropTypes.func.isRequired,
    uploadScript: PropTypes.func.isRequired,
    sendUpdatedDataWranglingScript: PropTypes.func.isRequired,
    dataSource: PropTypes.object.isRequired,
    match: PropTypes.shape({
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
    this.props.fetchDataWranglingScripts({ dataSourceId });
  }

  handleUploadScript = async ({ target }) => {
    const [file] = target.files;
    if (!file) {
      return;
    }

    try {
      const { dataSourceId } = this.props.match.params;
      this.setState({ uploading: true, errorOnUploading: false });

      await this.props.uploadScript({ script: file, dataSourceId });
    } catch (e) {
      this.setState({ uploading: false, errorOnUploading: true });
    } finally {
      this.setState({ uploading: false, errorOnUploading: false });
    }
  };

  handleChange = ({ e, setFieldValue, steps }) => {
    const { value, checked } = e.target;
    const setScripts = ifElse(equals(true), always(append(value, steps)), always(reject(equals(value), steps)));

    setFieldValue('steps', setScripts(checked));
  };

  handleSubmit = ({ steps }) => {
    const { dataSourceId } = this.props.match.params;
    steps = steps.map((script, index) => ({ script: parseInt(script, 10), execOrder: index }));

    this.props.sendUpdatedDataWranglingScript({ steps, dataSourceId });
  };

  renderCheckboxes = ({ id, name }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index} isEdit>
      <Link to={`/script/${id}`}>{name}</Link>
    </Checkbox>
  );

  renderErrorOnUploading = renderWhenTrue(
    always(
      <Error>
        <FormattedMessage {...messages.errorOnUploading} />
      </Error>
    )
  );

  render() {
    const { dataWranglingScripts, dataSource } = this.props;
    const { uploading, errorOnUploading } = this.state;
    const steps = pipe(
      pathOr([], ['jobs', 0, 'steps']),
      map(prop('script')),
      map(toString)
    )(dataSource);

    return (
      <Container>
        <Header>
          <Empty />
          <StepCounter>
            <FormattedMessage values={{ length: dataWranglingScripts.length }} {...messages.steps} />
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
        <Formik initialValues={{ steps }} onSubmit={this.handleSubmit}>
          {({ values: { steps }, setFieldValue, submitForm }) => {
            if (!steps.length) {
              submitForm = null;
            }

            return (
              <Fragment>
                <CheckboxGroup
                  onChange={e => this.handleChange({ e, setFieldValue, steps })}
                  value={steps}
                  name="steps"
                  id="fieldStepsCheckboxGroup"
                >
                  {dataWranglingScripts.map(this.renderCheckboxes)}
                </CheckboxGroup>
                <StepNavigation submitForm={submitForm} {...this.props} />
              </Fragment>
            );
          }}
        </Formik>
      </Container>
    );
  }
}
