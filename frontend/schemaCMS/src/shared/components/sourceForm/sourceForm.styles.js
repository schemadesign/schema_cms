import styled, { css } from 'styled-components';
import { colors } from '../../../theme/styled';
import { Link as LinkTypography } from '../../../theme/typography';
import { media } from '../../../theme/media';

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

export const SpreadsheetContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${media.desktop`
    flex-direction: row;
  `};
`;

export const SpreadsheetInput = styled.div`
  width: 100%;
`;

export const ReimportButtonContainer = styled.div`
  height: 48px;
  margin: -10px 0 40px;

  ${media.desktop`
    margin: 0 0 0 20px;
  `};
`;

export const Link = styled(LinkTypography)`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ApiSourceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ApiSourceUrlInputContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${media.desktop`
    flex-direction: row;
  `};
`;

export const ApiSourceInput = styled.div`
  width: 100%;
`;

export const ApiSourceSwitch = styled.div`
  border-top: 2px solid ${({ theme }) => theme.border};
  padding-top: 15px;
`;
