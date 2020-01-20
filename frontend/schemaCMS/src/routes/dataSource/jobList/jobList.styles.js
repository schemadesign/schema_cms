import styled from 'styled-components';
import { Icons } from 'schemaUI';

import { media } from '../../../theme/media';

export const Container = styled.div``;

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

export const customRadioGroupStyles = {
  flexDirection: 'column',
};

export const JobItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.text};
  width: 100%;
  border-top: 2px solid ${({ theme }) => theme.border};
  padding: 10px 0;
`;

export const JobItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const Dot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: ${({ theme }) => theme.text};
`;

export const Eye = styled(Icons.EyeIcon)`
  cursor: pointer;
  min-width: 30px;
`;

export const RadioLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 10px;
  flex-wrap: wrap;
`;

export const JobInformation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
  line-height: 18px;

  &:last-child {
    width: 100%;
    ${Dot} {
      display: none;
    }
  }

  ${media.bigMobile`
    &:last-child {
      width: auto;
      ${Dot} {
       display: block;
      }
    }
  `};
`;
