import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from '../../../theme/media';

const setColor = (loading, { label, text }) => (loading ? label : text);
const setColorWithTheme = inverse => ({ theme: { card }, loading }) => setColor(inverse ? !loading : loading, card);

export const Container = styled.div``;

export const Description = styled.div`
  margin: 7px 0 14px;
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
  color: ${setColorWithTheme()};
`;

export const MetaDataName = styled.span`
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 10px;
`;

export const MetaDataValue = styled.span`
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
`;

export const getSourceIconStyles = ({ card }, loading) => ({
  width: 40,
  height: 40,
  fill: setColor(loading, card),
});

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const HeaderIcon = styled.div`
  margin-top: -8px;
`;

export const Loading = styled.span`
  color: ${setColorWithTheme(true)};
`;

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
