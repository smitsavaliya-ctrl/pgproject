import { ACCOMMODATIONS } from './dataset.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export const CITIES = [
  { 
    id: 'city-1', 
    name: 'Bengaluru', 
    image: './assets/cities/bengaluru.jpg',
    fallback: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
    pgCount: 200, 
    landmark: 'Vidhana Soudha' 
  },
  { 
    id: 'city-2', 
    name: 'Delhi', 
    image: './assets/cities/delhi.jpg',
    fallback: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
    pgCount: 200, 
    landmark: 'India Gate' 
  },
  { 
    id: 'city-3', 
    name: 'Pune', 
    image: './assets/cities/pune.jpg',
    fallback: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=800&auto=format&fit=crop&q=80',
    pgCount: 200, 
    landmark: 'Shaniwar Wada Palace' 
  },
  { 
    id: 'city-4', 
    name: 'Jaipur', 
    image: './assets/cities/jaipur.jpg',
    fallback: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&auto=format&fit=crop&q=80',
    pgCount: 200, 
    landmark: 'Hawa Mahal' 
  },
  { 
    id: 'city-5', 
    name: 'Ahmedabad', 
    image: './assets/cities/ahmedabad.jpg',
    fallback: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=800&auto=format&fit=crop&q=80',
    pgCount: 200, 
    landmark: 'Sabarmati Riverfront' 
  },
  { 
    id: 'city-6', 
    name: 'Mumbai', 
    image: './assets/cities/mumbai.jpg',
    fallback: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    pgCount: 200, 
    landmark: 'Gateway of India' 
  }
];

export const POPULAR_AREAS = [
  'Andheri West', 'Juhu', 'Bandra West', 'Powai', 'Navrangpura', 'Vastrapur', 'Prahladnagar', 'Koramangala', 'HSR Layout', 'North Campus', 'Kothrud', 'Malviya Nagar'
];

export const MOCK_STATS = {
  totalStudents: 14250,
  totalOwners: 840,
  totalPgs: 1200,
  pendingApprovals: 12,
  reportedListings: 3
};

export { ACCOMMODATIONS };
