import { gql } from 'graphql-request';

/**
 * B2B Admin 로그인 Mutation
 */
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      companyId
      user {
        userId
        name
      }
      supportTypes
    }
  }
`;

