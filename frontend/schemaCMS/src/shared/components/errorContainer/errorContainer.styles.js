import styled from 'styled-components';

import { ERROR_TYPES } from './errorContainer.constants';

export const Container = styled.div`
  color: ${({ theme: { error } }) => error};
  font-weight: 200;

  ${({ type }) =>
    type === ERROR_TYPES.PAGE &&
    `
    text-align: center;
    padding: 50px 10px;
    font-size: 20px;
  `}
`;
