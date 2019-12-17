import styled from 'styled-components';
import { Link as LinkTypography } from '../../../theme/typography';

export const Container = styled.div``;

export const Link = styled(LinkTypography)`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;
