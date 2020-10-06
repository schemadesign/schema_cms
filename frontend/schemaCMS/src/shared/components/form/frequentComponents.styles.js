import styled from 'styled-components';
import { media } from '../../../theme/media';

export const Switches = styled.div`
  margin-top: 30px;
  border-top: 2px solid ${({ theme }) => theme.border};
  padding-top: 15px;
`;

export const SwitchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 15px;
  position: relative;
`;

export const SwitchLabel = styled.label`
  padding-right: 10px;
`;

export const SwitchCopy = styled.div`
  padding-left: 10px;
  max-width: 100%;
`;

export const SwitchContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 40px;
  max-width: 100%;
`;

export const BinIconContainer = styled.div`
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
`;

export const AvailableCopy = styled.span`
  color: ${({ theme }) => theme.secondaryText};
  min-width: 100%;
`;

export const Subtitle = styled.div`
  position: relative;
`;

export const IconsContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
`;

export const MobileInputName = styled.div`
  position: relative;

  ${media.desktop`
    display: none;
  `}
`;

export const PlusContainer = styled.div`
  text-align: right;
`;

export const MobilePlusContainer = styled.div`
  text-align: right;
  ${media.desktop`
    display: none;
  `}
`;

export const mobilePlusStyles = {
  width: 40,
  minHeight: 40,
  height: 40,
};

export const inputStyles = {
  fontSize: 24,
  fontWeight: 600,
};

export const binStyles = {
  cursor: 'pointer',
  width: 16,
  height: 16,
  margin: '-3px 0 0 5px',
};

export const inputContainerStyles = {
  paddingBottom: 0,
  paddingRight: 40,
  position: 'static',
};

export const CopySeparator = styled.span`
  padding: 0 10px;

  &:before {
    content: '|';
    display: inline;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  cursor: move;
  touch-action: none;
`;

export const menuIconStyles = { width: 10, marginRight: 20 };

export const Draft = styled.div`
  color: ${({ theme }) => theme.secondaryText};
  font-weight: bold;
  font-size: 14px;
`;
