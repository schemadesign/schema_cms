import styled, { css } from 'styled-components';
import { Theme, Typography } from 'schemaUI';
import { Link } from 'react-router-dom';
import { styleWhenTrue } from '../../../shared/utils/rendering';
import { media } from '../../../theme/media';

const MARGIN = '16.66px';

export const Container = styled.div``;

export const DataSourceItem = styled.li`
  margin-top: 25px;
  width: 100%;

  &:first-child {
    margin-top: 0;
  }

  ${media.desktop`
    flex: 0 0 auto;
    width: calc(33% - ${MARGIN});
    margin: 0 0 20px 20px;
    background: ${({ theme: { card } }) => card.background};
  `}
`;

export const Description = styled.div`
  margin: 7px 0 14px;
  cursor: pointer;
`;

export const DataSourceListWrapper = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 24px;

  ${media.desktop`
    display: flex;
    flex-wrap: wrap;
    margin-left: -20px;
  `}
`;

export const DataSourceTitle = styled(Typography.H1)`
  cursor: pointer;
`;

export const MetaDataWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 27px;
`;

export const MetaData = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MetaDataName = styled.span`
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 10px;
`;

const lockStyles = styleWhenTrue(
  ({ isLock }) => isLock,
  css`
    color: ${Theme.colors.coolGray};
  `
);

export const MetaDataValue = styled.span`
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;

  ${lockStyles}
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const HeaderIcon = styled.div`
  margin-top: -8px;
`;

export const iconSourceStyles = {
  width: 40,
  height: 40,
};

export const Job = styled(Link)`
  background-color: ${({ theme }) => theme.background};
  border-top: 3px solid ${({ theme }) => theme.card.background};
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  &:first-child {
    border: none;
  }
`;

export const JobDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  ${media.tablet`
    width: auto;
    justify-content: normal;
  `};
`;
