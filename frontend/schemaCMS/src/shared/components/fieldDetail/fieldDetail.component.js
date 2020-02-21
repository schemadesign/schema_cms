import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defaultTo, innerJoin, isNil, pipe } from 'ramda';

import { roundNumber } from '../../utils/numberFormating';
import { renderWhenTrue } from '../../utils/rendering';
import messages from './fieldDetail.messages';
import { EDITABLE_FIELDS, EMPTY, DEFAULT_STRUCTURE, INFORMATION_FIELDS } from './fieldDetail.constants';
import { Container, List, FieldInformation, FieldSummary, Label, Value, EditIcon } from './fieldDetail.styles';

export class FieldDetail extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  getTextValue = defaultTo('');

  getRoundedValue = pipe(
    roundNumber,
    this.getTextValue
  );

  renderEditIcon = renderWhenTrue(() => <EditIcon />);

  renderItem = (id, index) => {
    const value = this.props.data[id];
    const [titleValue, roundedValue] = isNil(value)
      ? [EMPTY, EMPTY]
      : [this.getTextValue(value), this.getRoundedValue(value)];

    const isInformationField = INFORMATION_FIELDS.includes(id);
    const isEditable = EDITABLE_FIELDS.includes(id);
    const Item = isInformationField ? FieldInformation : FieldSummary;

    return (
      <Item key={index}>
        <Label>{this.props.intl.formatMessage(messages[id])}</Label>
        <Value title={titleValue}>{roundedValue}</Value>
        {this.renderEditIcon(isEditable)}
      </Item>
    );
  };

  render() {
    const labelsIds = innerJoin(
      (structureId, dataId) => structureId === dataId,
      DEFAULT_STRUCTURE,
      Object.keys(this.props.data)
    );

    return (
      <Container id={`fieldInfo-${this.props.step}`}>
        <List id="fieldInfoTable">
          <FieldInformation>
            <Label>{this.props.intl.formatMessage(messages.field)}</Label>
            <Value>{this.props.id}</Value>
          </FieldInformation>
          {labelsIds.map(this.renderItem)}
        </List>
      </Container>
    );
  }
}
