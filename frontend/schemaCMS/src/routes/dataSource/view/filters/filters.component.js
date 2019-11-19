import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Icons } from 'schemaUI';
import { Formik } from 'formik';
import { always, append, equals, ifElse, path, reject } from 'ramda';

import { ButtonContainer, Container, FilterCounter, Header, Link, PlusButton } from './filters.styles';
import { StepNavigation } from '../../../../shared/components/stepNavigation';
import messages from './filters.messages';
import { renderWhenTrueOtherwise } from '../../../../shared/utils/rendering';
import { Loading } from '../../../../shared/components/loading';
import { FILTERS_STEP } from '../../../../modules/dataSource/dataSource.constants';

const { PlusIcon } = Icons;
const { CheckboxGroup, Checkbox } = Form;

export class Filters extends PureComponent {
  static propTypes = {
    filters: PropTypes.array.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    try {
      const dataSourceId = path(['match', 'params', 'dataSourceId'])(this.props);

      await this.props.fetchFilters({ dataSourceId });
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  handleChange = ({ e, setValues, values }) => {
    const { value, checked } = e.target;
    const setFilters = ifElse(equals(true), always(append(value, values)), always(reject(equals(value), values)));

    setValues(setFilters(checked));
  };

  handleSubmit = active => {
    const dataSourceId = path(['match', 'params', 'dataSourceId'])(this.props);
    const inactive = this.props.filters
      .filter(({ id }) => !active.includes(id.toString()))
      .map(({ id }) => id.toString());

    this.props.setFilters({ dataSourceId, active, inactive });
  };

  handleCreateFilter = () => {
    const dataSourceId = path(['match', 'params', 'dataSourceId'])(this.props);
    this.props.history.push(`/datasource/${dataSourceId}/${FILTERS_STEP}/add`);
  };

  renderCheckboxes = ({ id, name }, index) => (
    <Checkbox id={`checkbox-${index}`} value={id.toString()} key={index} isEdit>
      <Link to={`/filter/${id}`}>{name}</Link>
    </Checkbox>
  );

  renderContent = renderWhenTrueOtherwise(always(<Loading />), () => {
    const { filters } = this.props;
    const initialValues = filters.filter(({ isActive }) => isActive).map(({ id }) => id.toString());

    return (
      <Fragment>
        <Header>
          <ButtonContainer>
            <PlusButton onClick={this.handleCreateFilter}>
              <PlusIcon />
            </PlusButton>
          </ButtonContainer>
          <FilterCounter>
            <FormattedMessage values={{ length: filters.length }} {...messages.filters} />
          </FilterCounter>
        </Header>
        <Formik initialValues={initialValues} onSubmit={this.handleSubmit}>
          {({ values, setValues, submitForm, dirty }) => {
            if (!dirty) {
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
      </Fragment>
    );
  });

  render() {
    return <Container>{this.renderContent(this.state.loading)}</Container>;
  }
}
