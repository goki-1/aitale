/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      email
      userId
      username
      name
      posts
      savedPosts
      credits
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      email
      userId
      username
      name
      posts
      savedPosts
      credits
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      email
      userId
      username
      name
      posts
      savedPosts
      credits
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      title
      thumbnailUrl
      userId
      username
      saves
      nextParts
      previous
      next
      hashtags
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      title
      thumbnailUrl
      userId
      username
      saves
      nextParts
      previous
      next
      hashtags
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      title
      thumbnailUrl
      userId
      username
      saves
      nextParts
      previous
      next
      hashtags
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createHashtag = /* GraphQL */ `
  mutation CreateHashtag(
    $input: CreateHashtagInput!
    $condition: ModelHashtagConditionInput
  ) {
    createHashtag(input: $input, condition: $condition) {
      id
      hashtag
      imageUrl
      postIds
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateHashtag = /* GraphQL */ `
  mutation UpdateHashtag(
    $input: UpdateHashtagInput!
    $condition: ModelHashtagConditionInput
  ) {
    updateHashtag(input: $input, condition: $condition) {
      id
      hashtag
      imageUrl
      postIds
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteHashtag = /* GraphQL */ `
  mutation DeleteHashtag(
    $input: DeleteHashtagInput!
    $condition: ModelHashtagConditionInput
  ) {
    deleteHashtag(input: $input, condition: $condition) {
      id
      hashtag
      imageUrl
      postIds
      createdAt
      updatedAt
      __typename
    }
  }
`;
