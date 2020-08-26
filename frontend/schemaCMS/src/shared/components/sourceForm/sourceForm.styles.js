import styled, { css } from 'styled-components';
import { colors } from '../../../theme/styled';
import { Link as LinkTypography } from '../../../theme/typography';

export const Container = styled.div``;

export const buttonStyles = {
  width: 96,
  height: 96,
  marginBottom: 10,
  pointerEvents: 'none',
};

export const SourceButtonWrapper = styled.div`
  margin-right: 10px;
`;

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

const informationWrapperStyles = css`
  margin: -30px 0 40px;
`;

export const WarningWrapper = styled.div`
  color: ${colors.yellow};
  ${informationWrapperStyles};
`;

export const ErrorWrapper = styled.div`
  color: ${colors.red};
  ${informationWrapperStyles};
`;

export const Link = styled(LinkTypography)`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;
