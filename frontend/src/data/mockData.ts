import { User, SwapRequest, Rating } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    location: 'San Francisco, CA',
    profilePhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['React', 'JavaScript', 'UI/UX Design'],
    skillsWanted: ['Python', 'Data Analysis', 'Digital Marketing'],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    rating: 4.7,
    totalRatings: 3,
    joinedDate: '2024-01-15',
    isProfileComplete: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    location: 'New York, NY',
    profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['Python', 'Machine Learning', 'Data Analysis'],
    skillsWanted: ['React', 'Mobile Development', 'Graphic Design'],
    availability: ['Weekdays', 'Evenings'],
    isPublic: true,
    rating: 5.0,
    totalRatings: 1,
    joinedDate: '2024-02-03',
    isProfileComplete: true
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    location: 'Austin, TX',
    profilePhoto: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['Digital Marketing', 'Content Writing', 'SEO'],
    skillsWanted: ['Web Development', 'Photography', 'Video Editing'],
    availability: ['Weekends', 'Flexible'],
    isPublic: true,
    rating: 4.7,
    totalRatings: 15,
    joinedDate: '2024-01-28',
    isProfileComplete: true
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    location: 'Seattle, WA',
    profilePhoto: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['Photography', 'Video Editing', 'Graphic Design'],
    skillsWanted: ['Web Development', 'Digital Marketing', 'Writing'],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    rating: 4.5,
    totalRatings: 2,
    joinedDate: '2024-02-10',
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