import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { has, isNil } from 'ramda';

import { renderWhenTrue } from '../../../../../../shared/utils/rendering';
import messages from './details.messages';
import { EMPTY, STRUCTURE, TYPES } from './details.constants';
import { Container, List, FieldInformation, FieldSummary, Label, Value, EditIcon } from './details.styles';

const ITEMS_TYPE = {
  [TYPES.SHORT]: FieldSummary,
  [TYPES.LONG]: FieldInformation,
};

export class Details extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  defaultFormat = value => `${value}`;

  renderEditIcon = renderWhenTrue(() => <EditIcon />);

  renderItem = ([list, index], { id, label, type, isEditable = false, format = this.defaultFormat }) => {
    if (!has(id)(this.props.data)) {
      return [list, index];
    }

    const value = this.props.data[id];
    const textValue = isNil(value) ? EMPTY : format(value);
    const key = list.length;
    const nextIndex = type === TYPES.SHORT ? index + 1 : 0;
    const Item = ITEMS_TYPE[type];

    list.push(
      <Item key={key} index={index}>
        <Label>{this.props.intl.formatMessage(label)}</Label>
        <Value>{textValue}</Value>
        {this.renderEditIcon(isEditable)}
      </Item>
    );

    return [list, nextIndex];
  };

  render() {
    const [content] = STRUCTURE.reduce(this.renderItem, [[], 0]);

    return (
      <Container>
        <List>
          <FieldInformation>
            <Label>{this.props.intl.formatMessage(messages.field)}</Label>
            {this.props.id}
          </FieldInformation>
          {content}
        </List>
      </Container>
    );
  }
}
