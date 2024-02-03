/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      userId
      username
      name
      posts
      savedPosts
      interests
      followers
      likedPosts
      dislikedPosts
      viewedPosts
      credits
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        userId
        username
        name
        posts
        savedPosts
        interests
        followers
        likedPosts
        dislikedPosts
        viewedPosts
        credits
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      thumbnailUrl
      userId
      username
      views
      dateCreated
      likes
      dislikes
      saves
      nextParts
      hashtags
      postDetails {
        title
        content
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        thumbnailUrl
        userId
        username
        views
        dateCreated
        likes
        dislikes
        saves
        nextParts
        hashtags
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getHashtag = /* GraphQL */ `
  query GetHashtag($id: ID!) {
    getHashtag(id: $id) {
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
export const listHashtags = /* GraphQL */ `
  query ListHashtags(
    $filter: ModelHashtagFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHashtags(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        hashtag
        imageUrl
        postIds
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
