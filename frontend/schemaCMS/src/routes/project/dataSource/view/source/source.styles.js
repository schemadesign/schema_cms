import styled from 'styled-components';
import { Theme } from 'schemaUI';

export const Container = styled.div``;

export const customButtonStyles = {
  backgroundColor: Theme.colors.darkGrey,
  width: 96,
  height: 96,
  marginBottom: 10,
  pointerEvents: 'none',
};

export const customRadioButtonStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 96,
};

export const customLabelStyles = {
  marginBottom: 20,
};

export const customRadioGroupStyles = {
  marginBottom: '40px',
};
