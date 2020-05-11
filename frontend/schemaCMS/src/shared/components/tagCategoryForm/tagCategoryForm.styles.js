import styled from 'styled-components';
import { Form as FormikForm } from 'formik';

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
  border-top: 2px solid ${({ theme }) => theme.border};
`;

export const Form = styled(FormikForm)`
  padding-top: 24px;
`;

export const AddNewTagContainer = styled.div`
  text-align: center;
  padding: 20px 0 40px;
  cursor: pointer;
  color: ${({ theme }) => theme.secondaryText};
`;

export const Switches = styled.div`
  border-top: 2px solid ${({ theme }) => theme.border};
  padding: 10px 0 20px;
`;

export const removeIconStyles = {
  width: 35,
  height: 35,
  minWidth: 35,
  marginLeft: 5,
  cursor: 'pointer',
};
