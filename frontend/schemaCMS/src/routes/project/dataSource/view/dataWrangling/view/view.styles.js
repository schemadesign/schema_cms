import styled from 'styled-components';
import { Theme } from 'schemaUI';

export const Container = styled.div`
  margin: 0 20px;
`;

export const Form = styled.form``;

export const codeStyles = {
  fontFamily: Theme.light.typography.pre.fontFamily,
  backgroundColor: Theme.light.background,
  padding: '10px',
  marginTop: '10px',
};

export const rightButtonStyles = {
  backgroundColor: Theme.dark.background,
  color: Theme.dark.text,
};

export const customInputStyles = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};
