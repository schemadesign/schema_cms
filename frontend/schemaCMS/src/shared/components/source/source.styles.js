import styled from 'styled-components';
import { colors } from '../../../theme/styled';

const { Span: SpanUI } = Typography;

export const Container = styled.div``;

export const buttonStyles = {
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

export const WarningWrapper = styled.div`
  color: ${colors.yellow};
  margin-bottom: 40px;
`;
