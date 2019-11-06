import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Typography } from 'schemaUI';

import { media, contentSizes } from '../../../theme/media';

export const TopContainer = styled.div`
  display: none;

  ${media.desktop`
    display: flex;
    align-items: center;
    flex-direction: column;
    border-bottom: solid 2px ${({ theme: { card } }) => card.background};
    width: 100%;
  `}
`;

export const Container = styled.div`
  width: ${contentSizes.desktop}px;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  width: ${contentSizes.desktop - 50}px;
  height: 62px;
  flex: 1 1 auto;
  justify-content: space-between;
`;

export const Actions = styled.div`
  display: flex;
  flex: 0 0 auto;
`;

export const BaseLink = styled(Link)`
  display: flex;
  height: calc(100% - 20px);
  margin: 10px;
  align-items: center;
  cursor: pointer;
`;

export const LogoLink = styled(BaseLink)`
  flex: 0 0 auto;
  margin-left: 0;
`;

export const IconLink = styled(BaseLink)`
  margin-right: 0;
  padding: 0 7px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  margin: 0 10px;
  overflow: hidden;
  justify-content: center;
`;

export const Title = styled(Typography.H1)`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const headerCustomStyles = {
  padding: null,
};

export const customButtonStyles = {
  position: null,
  flex: '0 0 auto',
};
