import styled from 'styled-components';
import { always, cond, equals, T } from 'ramda';

import { ERROR_TYPES } from './errorContainer.constants';

const renderTypeSpecificStyles = cond([
  [
    equals(ERROR_TYPES.PAGE),
    always(`
    text-align: center;
    padding: 50px 10px;
    font-size: 20px;
  `),
  ],
  [T, always('')],
]);

export const Container = styled.div`
  color: ${({ theme: { error } }) => error};
  font-weight: 200;

  ${({ type }) => renderTypeSpecificStyles(type)}
`;
