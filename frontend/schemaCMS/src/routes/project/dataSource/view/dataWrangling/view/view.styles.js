import styled from 'styled-components';
import { Theme } from 'schemaUI';

export const Container = styled.div`
  margin: 0 20px;
`;

export const Form = styled.form``;

export const codeStyles = {
  fontFamily: Theme.primary.typography.pre.fontFamily,
  backgroundColor: Theme.primary.background,
  padding: '10px',
  marginTop: '10px',
};

export const rightButtonStyles = {
  backgroundColor: Theme.secondary.background,
  color: Theme.secondary.text,
};
