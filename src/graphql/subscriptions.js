/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost($filter: ModelSubscriptionPostFilterInput) {
    onCreatePost(filter: $filter) {
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost($filter: ModelSubscriptionPostFilterInput) {
    onUpdatePost(filter: $filter) {
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost($filter: ModelSubscriptionPostFilterInput) {
    onDeletePost(filter: $filter) {
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
export const onCreateHashtag = /* GraphQL */ `
  subscription OnCreateHashtag($filter: ModelSubscriptionHashtagFilterInput) {
    onCreateHashtag(filter: $filter) {
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
export const onUpdateHashtag = /* GraphQL */ `
  subscription OnUpdateHashtag($filter: ModelSubscriptionHashtagFilterInput) {
    onUpdateHashtag(filter: $filter) {
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
export const onDeleteHashtag = /* GraphQL */ `
  subscription OnDeleteHashtag($filter: ModelSubscriptionHashtagFilterInput) {
    onDeleteHashtag(filter: $filter) {
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
