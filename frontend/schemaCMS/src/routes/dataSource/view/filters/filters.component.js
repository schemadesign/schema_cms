import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Icons } from 'schemaUI';
import { Formik } from 'formik';
import { always, append, equals, ifElse, path, reject } from 'ramda';

import { ButtonContainer, Container, FilterCounter, Header, Link, PlusButton } from './filters.styles';
import { StepNavigation } from '../../../../shared/components/stepNavigation';
import messages from './filters.messages';

const { PlusIcon } = Icons;
const { CheckboxGroup, Checkbox } = Form;

export class Filters extends PureComponent {
  static propTypes = {
    filters: PropTypes.array,
    fetchFilters: PropTypes.func,
    setActiveFilters: PropTypes.func,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static defaultProps = {
    filters: [
      {
        id: 1,
        name: 'name',
        isActive: false,
      },
      {
        id: 2,
        name: 'name',
        isActive: true,
      },
    ],
  };

  async componentDidMount() {
    const dataSourceId = path(['match', 'params', 'dataSourceId'])(this.props);

    await this.props.fetchFilters({ dataSourceId });
  }

  handleChange = ({ e, setValues, values }) => {
    const { value, checked } = e.target;
    const setFilters = ifElse(equals(true), always(append(value, values)), always(reject(equals(value), values)));

    setValues(setFilters(checked));
  };

  handleSubmit = filters => {
    this.props.setActiveFilters({ filters });
  };

  renderCheckboxes = ({ id, name }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index} isEdit>
      <Link to={`/script/${id}`}>{name}</Link>
    </Checkbox>
  );

  render() {
    const { filters } = this.props;
    const initialValues = filters.filter(({ isActive }) => isActive).map(({ id }) => id.toString());

    return (
      <Container>
        <Header>
          <ButtonContainer>
            <PlusButton>
              <PlusIcon />
            </PlusButton>
          </ButtonContainer>
          <FilterCounter>
            <FormattedMessage values={{ length: filters.length }} {...messages.filters} />
          </FilterCounter>
        </Header>
        <Formik initialValues={initialValues} onSubmit={this.handleSubmit}>
          {({ values, setValues, submitForm }) => {
            if (!values.length) {
              submitForm = null;
            }

            return (
              <Fragment>
                <CheckboxGroup
                  onChange={e => this.handleChange({ e, setValues, values })}
                  value={values}
                  name="steps"
                  id="fieldStepsCheckboxGroup"
                >
                  {filters.map(this.renderCheckboxes)}
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
