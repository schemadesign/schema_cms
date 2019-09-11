import styled from 'styled-components';
import { Theme } from 'schemaUI';

import { Container as DefaultContainer } from '../../../shared/components/styledComponents/container';

export const Container = styled(DefaultContainer)`
  font-weight: 600;
`;

export const ProjectView = styled.div`
  margin-top: 7px;
`;

export const Details = styled.ul`
  list-style: none;
  font-size: 14px;
  padding: 0;
`;

export const DetailItem = styled.li`
  color: ${Theme.primary.text};
  margin-bottom: 4px;
  border-top: 2px solid ${Theme.primary.background};
  display: flex;
`;

export const DetailWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(100% - 37px);
  padding: 12px 0 8px 0;
`;

export const DetailLabel = styled.span`
  color: ${Theme.primary.label};
  margin-right: 5px;
`;

export const IconEditWrapper = styled.div`
  margin: 5px 0 0 7px;
`;

export const DetailValue = styled.span`
  display: inline-block;
`;

export const Statistics = styled.ul`
  margin-bottom: 15px;
  padding: 0;
`;

export const CardWrapper = styled.li`
  display: inline-block;
  width: calc(50% - 7px);
  margin-bottom: 14px;

  &:nth-child(2n + 1) {
    margin-right: 7px;
  }

  &:nth-child(2n) {
    margin-left: 7px;
  }
`;

export const CardValue = styled.span`
  display: block;
  font-size: 66px;
  line-height: 1.09;
  letter-spacing: -3px;
`;

export const buttonStyles = {
  margin: '50px 0 20px 0',
  backgroundColor: Theme.primary.background,
  height: '60px',
};

export const statisticsCardStyles = {
  cursor: 'pointer',
};
