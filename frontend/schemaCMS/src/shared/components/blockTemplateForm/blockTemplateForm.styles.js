import styled from 'styled-components';
import { media } from '../../../theme/media';

export const Container = styled.div``;

export const Subtitle = styled.div`
  position: relative;
`;

export const IconsContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

export const MobileInputName = styled.div`
  position: relative;

  ${media.desktop`
    display: none;
  `}
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

export const inputContainerStyles = {
  paddingBottom: 0,
  paddingRight: 40,
  position: 'static',
};
