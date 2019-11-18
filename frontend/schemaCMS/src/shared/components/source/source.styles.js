import styled from 'styled-components';
import { Typography } from 'schemaUI';
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

export const Link = styled(SpanUI)`
  cursor: pointer;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.text};
  transition: border 400ms;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid ${({ theme }) => theme.text};
  }
`;

export const LinkContainer = styled.div`
  border-top: 2px solid ${({ theme }) => theme.label.border};
  padding-top: 35px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
