const bcrypt = require('bcryptjs');

// Pre-hashed passwords for default accounts
const salt = bcrypt.genSaltSync(10);

const store = {
  users: [
    {
      _id: 'user-admin-1',
      name: 'Admin User',
      email: 'admin@eventhub.com',
      password: bcrypt.hashSync('adminpassword123', salt),
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'user-demo-1',
      name: 'Vidushi Singh',
      email: 'user@eventhub.com',
      password: bcrypt.hashSync('userpassword123', salt),
      role: 'user',
      createdAt: new Date().toISOString(),
    },
  ],

  events: [
    {
      _id: 'event-1',
      title: 'Tech Fest 2026',
      description: 'A nationwide technology festival featuring hackathons, keynote talks, and hands-on developer challenges.',
      date: '2026-09-20',
      time: '09:00 AM',
      location: 'Mumbai Convention Center',
      category: 'Technology',
      capacity: 250,
      registeredCount: 42,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      createdBy: 'user-admin-1',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'event-2',
      title: 'React & Next.js Masterclass',
      description: 'Learn modern React patterns, Server Components, Vite optimizations, and state management techniques from industry experts.',
      date: '2026-09-25',
      time: '11:00 AM',
      location: 'Pune Tech Park',
      category: 'Workshop',
      capacity: 120,
      registeredCount: 88,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      createdBy: 'user-admin-1',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'event-3',
      title: 'Global AI Summit 2026',
      description: 'Explore generative AI, autonomous agents, computer vision, and neural network architectures shaping the future.',
      date: '2026-09-30',
      time: '10:00 AM',
      location: 'Bangalore Innovation Hub',
      category: 'Conference',
      capacity: 300,
      registeredCount: 175,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      createdBy: 'user-admin-1',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'event-4',
      title: 'Design Systems & UI/UX Expo',
      description: 'Deep dive into micro-interactions, responsive interfaces, accessibility, and modern CSS architecture.',
      date: '2026-10-10',
      time: '02:00 PM',
      location: 'Delhi Exhibition Hall',
      category: 'Design',
      capacity: 150,
      registeredCount: 60,
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      createdBy: 'user-admin-1',
      createdAt: new Date().toISOString(),
    },
  ],

  registrations: [
    {
      _id: 'reg-demo-1',
      user: 'user-demo-1',
      event: 'event-1',
      status: 'confirmed',
      registrationDate: new Date().toISOString(),
    },
  ],
};

module.exports = store;
