import { User, SwapRequest, Rating } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    location: 'Bangalore, Karnataka',
    profilePhoto: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['React', 'JavaScript', 'UI/UX Design'],
    skillsWanted: ['Python', 'Machine Learning', 'SEO'],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    rating: 4.8,
    totalRatings: 5,
    joinedDate: '2024-01-18',
    isProfileComplete: true
  },
  {
    id: '2',
    name: 'Rohit Verma',
    email: 'rohit.verma@example.com',
    location: 'Mumbai, Maharashtra',
    profilePhoto: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['Python', 'Data Analysis', 'Power BI'],
    skillsWanted: ['React Native', 'Figma', 'Content Writing'],
    availability: ['Weekdays', 'Evenings'],
    isPublic: true,
    rating: 4.9,
    totalRatings: 4,
    joinedDate: '2024-02-07',
    isProfileComplete: true
  },
  {
    id: '3',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    location: 'Chennai, Tamil Nadu',
    profilePhoto: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['Digital Marketing', 'SEO', 'Instagram Growth'],
    skillsWanted: ['Web Development', 'Photography', 'Illustration'],
    availability: ['Flexible', 'Weekends'],
    isPublic: true,
    rating: 4.6,
    totalRatings: 10,
    joinedDate: '2024-01-24',
    isProfileComplete: true
  },
  {
    id: '4',
    name: 'Arjun Patel',
    email: 'arjun.patel@example.com',
    location: 'Ahmedabad, Gujarat',
    profilePhoto: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['Photography', 'Video Editing', 'Canva Design'],
    skillsWanted: ['Web Design', 'Blog Writing', 'YouTube Marketing'],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    rating: 4.5,
    totalRatings: 3,
    joinedDate: '2024-02-12',
    isProfileComplete: true
  }

];

export const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    fromUserId: '1',
    toUserId: '2',
    skillOffered: 'React',
    skillWanted: 'Python',
    status: 'pending',
    message: 'Hi! I\'d love to learn Python from you in exchange for React lessons. I have 3 years of experience with React.',
    createdAt: '2024-12-20T10:00:00Z'
  },
  {
    id: '2',
    fromUserId: '3',
    toUserId: '1',
    skillOffered: 'Digital Marketing',
    skillWanted: 'UI/UX Design',
    status: 'accepted',
    message: 'I can help you with digital marketing strategies in exchange for UI/UX design tips!',
    createdAt: '2024-12-18T14:30:00Z'
  },
  {
    id: '3',
    fromUserId: '2',
    toUserId: '4',
    skillOffered: 'Python',
    skillWanted: 'Photography',
    status: 'completed',
    message: 'I can teach you Python programming in exchange for photography lessons!',
    createdAt: '2024-12-15T09:00:00Z',
    completedAt: '2024-12-17T16:00:00Z'
  },
  {
    id: '4',
    fromUserId: '4',
    toUserId: '1',
    skillOffered: 'Video Editing',
    skillWanted: 'JavaScript',
    status: 'completed',
    message: 'I\'m great at video editing and would love to learn JavaScript!',
    createdAt: '2024-12-10T11:00:00Z',
    completedAt: '2024-12-12T14:00:00Z'
  }
];

export const mockRatings: Rating[] = [
  {
    id: '1',
    swapRequestId: '2',
    fromUserId: '3',
    toUserId: '1',
    rating: 5,
    feedback: 'Amazing teacher! Sarah really knows her stuff about UI/UX design.',
    createdAt: '2024-12-19T16:00:00Z'
  },
  {
    id: '2',
    swapRequestId: '3',
    fromUserId: '2',
    toUserId: '4',
    rating: 4,
    feedback: 'Great photography session! David was very patient and explained everything clearly. Learned a lot about composition and lighting.',
    createdAt: '2024-12-18T10:00:00Z'
  },
  {
    id: '3',
    swapRequestId: '3',
    fromUserId: '4',
    toUserId: '2',
    rating: 5,
    feedback: 'Michael is an excellent Python teacher! He made complex concepts easy to understand. Highly recommend!',
    createdAt: '2024-12-18T11:00:00Z'
  },
  {
    id: '4',
    swapRequestId: '4',
    fromUserId: '4',
    toUserId: '1',
    rating: 4,
    feedback: 'Sarah taught me JavaScript fundamentals really well. Her explanations were clear and she was very encouraging.',
    createdAt: '2024-12-13T15:00:00Z'
  },
  {
    id: '5',
    swapRequestId: '4',
    fromUserId: '1',
    toUserId: '4',
    rating: 5,
    feedback: 'David is a fantastic video editor! He showed me advanced techniques I never knew existed. Great session!',
    createdAt: '2024-12-13T16:00:00Z'
  }
];
