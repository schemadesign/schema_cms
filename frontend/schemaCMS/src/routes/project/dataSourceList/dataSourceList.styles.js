import styled, { css } from 'styled-components';
import { Theme } from 'schemaUI';
import { always, cond, equals } from 'ramda';
import { styleWhenTrue } from '../../../shared/utils/rendering';
import { media } from '../../../theme/media';
import { colors } from '../../../theme/styled';

export const Container = styled.div``;

export const DataSourceItem = styled.li`
  margin-top: 25px;

  &:first-child {
    margin-top: 0;
  }
`;

export const Description = styled.div`
  margin: 7px 0 14px;
  cursor: pointer;
`;

export const DataSourceListWrapper = styled.div`
  list-style: none;
  padding: 0;
  margin-top: 24px;
`;

export const titleStyles = {
  cursor: 'pointer',
  marginBottom: '20px',
};

export const MetaDataWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

export const ErrorsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Error = styled.div``;

export const lockTextStyles = {
  color: Theme.colors.coolGray,
};

export const iconSourceStyles = {
  width: 40,
  height: 40,
};

export const lockIconStyles = {
  display: 'none',
};

export const JobsContainer = styled.div``;

export const Job = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-top: 3px solid ${({ theme }) => theme.card.background};
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
  `}
`;

const getStatusColor = cond([
  [equals('error'), always(colors.red)],
  [equals('idle'), always(colors.yellow)],
  [equals('process'), always(colors.blue)],
  [equals('done'), always(colors.green)],
]);

export const JobStatus = styled.div`
  color: ${({ status }) => getStatusColor(status)};
  min-width: 80px;
  padding: 10px;
`;

export const JobName = styled.div`
  padding: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const JobDate = styled.div`
  padding: 10px;
`;

export const JobsTitle = styled.div`
  margin: 10px 0;
`;
