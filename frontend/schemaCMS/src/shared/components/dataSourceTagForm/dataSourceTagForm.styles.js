import styled from 'styled-components';
import { Form as FormikForm } from 'formik';
import { Button } from 'schemaUI';

export const Tag = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.border};
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TagsContainer = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  padding-bottom: 20px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const PlusButton = styled(Button)`
  height: 60px;
`;

export const Form = styled(FormikForm)`
  padding-top: 24px;
`;

export const removeIconStyles = {
  width: 35,
  height: 35,
  minWidth: 35,
  marginLeft: 5,
  cursor: 'pointer',
};
