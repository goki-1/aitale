const dummyUsers = [
    {
      //id: '8dadb18b-5fae-4705-bdbe-6ee69b2bc3df',
      id:'user1',
      username: 'john_doe',
      name: 'John Doe',
      email: 'john.doe@example.com',
      posts: ['post1', 'post2', 'post3'],
      savedPosts: ['post4', 'post5'],
      interests: ['user2', 'user3', '#ironwoman', '#BlackWidow'],
      followers: ['user2', 'user3'],
      likedPosts: ['post2', 'post5'],
      dislikedPosts: ['post3'],
      viewedPosts: ['post1', 'post4'],
      credits:10,
    },
    {
      //id: '202167b0-ac18-49a4-af93-b20013277e53',
      id:'user2',
      username: 'jane_doe',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      posts: ['post4', 'post5'],
      savedPosts: ['post1', 'post3'],
      interests: ['user1', 'user3', '#ironwoman', '#superhero'],
      followers: ['user1'],
      likedPosts: ['post1', 'post3'],
      dislikedPosts: ['post2'],
      viewedPosts: ['post5', 'post6'],
      credits:10,
    },
    {
      //id: 'f5726702-0a9a-455d-8e34-777f1c2d1134',
      id:'user3',
      username: 'alice',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      posts: ['post6, post7'],
      savedPosts: ['post2', 'post3'],
      interests: ['user1', 'user2', '#superhero', '#BlackWidow'],
      followers: ['user1', 'user2'],
      likedPosts: ['post4', 'post6'],
      dislikedPosts: ['post1'],
      viewedPosts: ['post2', 'post3'],
      credits:1,
    },
    // Add more dummy users as needed
  ];
  

  export default dummyUsers;
  