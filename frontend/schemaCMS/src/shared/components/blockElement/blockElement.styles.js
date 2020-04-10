import styled from 'styled-components';

import { media } from '../../../theme/media';

const ICON_CONTAINER_WIDTH = 50;

export const DetailsContainer = styled.div`
  ${media.desktop`
    padding-left: ${ICON_CONTAINER_WIDTH}px;
  `}
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Name = styled.div``;

export const InputContainer = styled.div`
  position: relative;
  padding-bottom: 30px;
`;

export const IconContainer = styled.div`
  width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;

  ${media.desktop`
    width: ${ICON_CONTAINER_WIDTH}px;
  `}
`;

export const getCustomInputStyles = theme => ({
  backgroundColor: theme.secondaryText,
  padding: '10px 30px 10px 20px',
});

export const customStyles = {
  paddingBottom: 2,
};

export const editIconStyles = {
  position: 'absolute',
  right: 5,
  top: 5,
};
