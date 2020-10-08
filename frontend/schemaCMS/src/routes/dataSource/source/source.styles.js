import styled from 'styled-components';
import { Link as RRDLink } from 'react-router-dom';

import { colors } from '../../../theme/styled';
import { Link as LinkTypography } from '../../../theme/typography';

export const Form = styled.form``;

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

export const Button = styled(LinkTypography)`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Link = styled(Button).attrs({ as: RRDLink })`
  text-decoration: none;
`;
