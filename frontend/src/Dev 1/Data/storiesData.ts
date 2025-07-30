export interface Story {
  id: string;
  name: string;
  type: 'image' | 'video' | 'text';
  content?: string;
  url?: any;
  timestamp: string;
  isViewed?: boolean;
}

export interface UserStory {
  id: string;
  type: 'image' | 'video' | 'text';
  content?: string;
  url?: any;
  timestamp: string;
}

// Mock stories data
export const storiesData: Story[] = [
  {
    id: '1',
    name: 'Bobee Jnr',
    type: 'image',
    url: require('../../../assets/avatars/everything/orbixa.png'),
    timestamp: '2 hours ago',
    isViewed: false,
  },
  {
    id: '2',
    name: 'Mirabelle',
    type: 'video',
    url: require('../../../assets/avatars/everything/orbixa.png'),
    timestamp: '3 hours ago',
    isViewed: true,
  },
  {
    id: '3',
    name: 'Nikano Miku',
    type: 'text',
    content: 'Having a great day! 🌟',
    timestamp: '5 hours ago',
    isViewed: false,
  },
];

// User's own stories
let userStories: UserStory[] = [];

export const getUserStories = (): UserStory[] => {
  return userStories;
};

export const addUserStory = (story: UserStory) => {
  userStories = [story, ...userStories];
  // Keep only last 10 stories
  if (userStories.length > 10) {
    userStories = userStories.slice(0, 10);
  }
};

export const clearUserStories = () => {
  userStories = [];
};

// Detailed stories data for story viewer
export const detailedStoriesData = [
  {
    id: '1',
    name: 'Bobee Jnr',
    avatar: require('../../../assets/avatars/everything/orbixa.png'),
    stories: [
      {
        id: '1-1',
        type: 'image',
        url: require('../../../assets/avatars/everything/orbixa.png'),
        duration: 5000,
      },
      {
        id: '1-2',
        type: 'text',
        content: 'Having a great day! 🌟',
        backgroundColor: '#FF6B6B',
        textColor: '#FFFFFF',
        duration: 3000,
      },
    ],
  },
  {
    id: '2',
    name: 'Mirabelle',
    avatar: require('../../../assets/avatars/everything/orbixa.png'),
    stories: [
      {
        id: '2-1',
        type: 'video',
        url: require('../../../assets/avatars/everything/orbixa.png'),
        duration: 8000,
      },
    ],
  },
  {
    id: '3',
    name: 'Nikano Miku',
    avatar: require('../../../assets/avatars/everything/orbixa.png'),
    stories: [
      {
        id: '3-1',
        type: 'text',
        content: 'Working on something amazing! 💻',
        backgroundColor: '#4ECDC4',
        textColor: '#FFFFFF',
        duration: 4000,
      },
    ],
  },
]; 