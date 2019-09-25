import styled from 'styled-components';
import { Theme } from 'schemaUI';

export const Container = styled.div`
  margin: 0 20px;
`;

export const Form = styled.form``;

export const rightButtonStyles = {
  backgroundColor: Theme.dark.background,
  color: Theme.dark.text,
};

export const customInputStyles = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};
