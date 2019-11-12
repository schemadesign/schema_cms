import styled from 'styled-components';
import { Icons } from 'schemaUI';

export const Container = styled.div``;

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

export const JobItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.grey};
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
  margin: 10px;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const RadioInput = styled.input`
  margin-right: 15px;
`;

export const Eye = styled(Icons.EyeIcon)`
  cursor: pointer;
`;

export const RadioLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
`;
