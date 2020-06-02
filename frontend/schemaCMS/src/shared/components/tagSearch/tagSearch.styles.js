import styled from 'styled-components';

export const Container = styled.div`
  padding-bottom: 30px;
`;

export const Title = styled.div`
  font-size: 15px;
  padding: 20px 0 5px;
`;

export const Category = styled.span`
  color: ${({ theme }) => theme.secondaryText};
`;

export const TagsContainer = styled.div`
  margin-top: 10px;
  padding: 0 20px 20px;
`;

export const NoTags = styled.div`
  margin-top: 15px;
  text-align: center;
  color: ${({ theme }) => theme.secondaryText};
`;
