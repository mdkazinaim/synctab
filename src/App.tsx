import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Bookmark as BookmarkIcon,
  Plus,
  Trash2,
  Save,
  FileText,
  CheckSquare,
  MessageSquare,
  Users,
  Clock,
  Globe,
  Check,
  Sun,
  Moon,
  ChevronRight,
  X
} from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

interface User {
  id: string;
  name: string;
  email: string | null;
  avatar: string;
  status: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  isShared: boolean;
  userId: string;
  updatedAt: string;
  user: { id: string; name: string; avatar: string };
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  assigneeId: string | null;
  creatorId: string;
  assignee?: { id: string; name: string; avatar: string } | null;
  creator?: { id: string; name: string; avatar: string };
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  clicks: number;
  isShared: boolean;
  userId: string;
}

interface Reminder {
  id: string;
  text: string;
  dueDate: string;
  isCompleted: boolean;
  userId: string;
}

interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
  user: { id: string; name: string; avatar: string };
}

function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookmarks' | 'notes' | 'tasks' | 'reminders'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Database lists
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Bookmark sorting/categories
  const [selectedBookmarkCat, setSelectedBookmarkCat] = useState<string>('All');
  
  // Modals state
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Form states
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', category: 'Work', isShared: true });
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', assigneeId: '', dueDate: '' });
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  // Saving state indicator for notes
  const [noteSavingStatus, setNoteSavingStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');

  // Time & Date state
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Authentication states
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'google'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authAvatar, setAuthAvatar] = useState('avatar-1');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isGoogleSimOpen, setIsGoogleSimOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Time ticker
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Theme effect
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
    }
  }, [isDarkMode]);

  // Google login is handled dynamically via handleGoogleLoginClick popup flow

  // Connect to APIs and WebSockets
  useEffect(() => {
    // Initial fetch
    initApp();

    // Socket.io Connection
    const socket = io(API_BASE);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsOnline(true);
    });

    socket.on('disconnect', () => {
      setIsOnline(false);
    });

    // Real-time Event Subscriptions
    socket.on('presence_updated', (data: { userId: string; name: string; status: string }) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === data.userId ? { ...u, status: data.status } : u))
      );
      // Update simulated currentUser status if matching
      setCurrentUser((prev) =>
        prev && prev.id === data.userId ? { ...prev, status: data.status } : prev
      );
    });

    socket.on('message_received', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on('note_updated', (data: { action: string; note: Note }) => {
      const { action, note } = data;
      if (action === 'create') {
        setNotes((prev) => {
          if (prev.some((n) => n.id === note.id)) return prev;
          return [note, ...prev];
        });
      } else if (action === 'update') {
        setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
        setSelectedNote((prev) => (prev && prev.id === note.id ? note : prev));
      } else if (action === 'delete') {
        setNotes((prev) => prev.filter((n) => n.id !== note.id));
        setSelectedNote((prev) => (prev && prev.id === note.id ? null : prev));
      }
    });

    socket.on('task_updated', (data: { action: string; task: Task }) => {
      const { action, task } = data;
      if (action === 'create') {
        setTasks((prev) => {
          if (prev.some((t) => t.id === task.id)) return prev;
          return [task, ...prev];
        });
      } else if (action === 'update') {
        setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      } else if (action === 'delete') {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
      }
    });

    socket.on('bookmark_updated', (data: { action: string; bookmark: Bookmark }) => {
      const { action, bookmark } = data;
      if (action === 'create') {
        setBookmarks((prev) => {
          if (prev.some((b) => b.id === bookmark.id)) return prev;
          return [bookmark, ...prev];
        });
      } else if (action === 'update') {
        setBookmarks((prev) => prev.map((b) => (b.id === bookmark.id ? bookmark : b)));
      } else if (action === 'delete') {
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id));
      }
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch reminders whenever current user changes
  useEffect(() => {
    if (currentUser) {
      fetchReminders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Scroll chat to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const initApp = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users
      const resUsers = await fetch(`${API_BASE}/users`);
      if (!resUsers.ok) throw new Error('API server down');
      const usersData: User[] = await resUsers.json();
      setUsers(usersData);

      // Restore user session from localStorage if exists
      const cached = localStorage.getItem('synctab_user');
      let activeUser: User | null = null;
      if (cached) {
        const cachedUser = JSON.parse(cached) as User;
        const matchedUser = usersData.find((u) => u.id === cachedUser.id);
        if (matchedUser) {
          activeUser = matchedUser;
          setCurrentUser(matchedUser);
        }
      }

      if (activeUser) {
        // 2. Fetch user-specific and workspace data
        await Promise.all([
          fetchNotes(activeUser),
          fetchBookmarks(activeUser),
          fetchTasks(),
          fetchChatMessages()
        ]);
      } else {
        setCurrentUser(null);
      }

      setIsOnline(true);
    } catch (err) {
      console.error('Error fetching data from SyncTab Backend, running in Offline Demo Mode', err);
      setIsOnline(false);
      setupMockData();
    } finally {
      setLoading(false);
    }
  };

  // Mock fallbacks if backend server isn't running
  const setupMockData = () => {
    const mockUsers: User[] = [
      { id: '1', name: 'Sarah Connor', email: 'sarah@skynet.com', avatar: 'avatar-1', status: 'Active' },
      { id: '2', name: 'John Doe', email: 'john@office.com', avatar: 'avatar-2', status: 'In Meeting' },
      { id: '3', name: 'Jane Smith', email: 'jane@corporate.com', avatar: 'avatar-3', status: 'Away' },
      { id: '4', name: 'Alice Johnson', email: 'alice@design.com', avatar: 'avatar-4', status: 'Active' }
    ];
    setUsers(mockUsers);

    const cached = localStorage.getItem('synctab_user');
    if (cached) {
      setCurrentUser(JSON.parse(cached));
    } else {
      setCurrentUser(null);
    }

    const mockBookmarks: Bookmark[] = [
      { id: 'b1', title: 'Office Portal', url: 'https://office.com', category: 'Work', clicks: 12, isShared: true, userId: '1' },
      { id: 'b2', title: 'Company GitHub', url: 'https://github.com', category: 'Development', clicks: 24, isShared: true, userId: '2' },
      { id: 'b3', title: 'Figma Designs', url: 'https://figma.com', category: 'Design', clicks: 18, isShared: true, userId: '4' },
      { id: 'b4', title: 'SyncTab Issues', url: 'https://github.com/issues', category: 'Development', clicks: 5, isShared: true, userId: '3' },
      { id: 'b5', title: 'My Personal Hub', url: 'https://news.ycombinator.com', category: 'Tech News', clicks: 3, isShared: false, userId: '2' }
    ];
    setBookmarks(mockBookmarks);

    const mockNotes: Note[] = [
      {
        id: 'n1',
        title: '📌 Team Standup Meeting Notes',
        content: `### Standup Notes\n\n- Sarah: Finalize the client dashboard layout.\n- John: Investigate NestJS connection drops.\n- Alice: Style the custom bookmarks section.\n\n*Next meeting tomorrow at 9:30 AM.*`,
        isShared: true,
        userId: '1',
        updatedAt: new Date().toISOString(),
        user: { id: '1', name: 'Sarah Connor', avatar: 'avatar-1' }
      },
      {
        id: 'n2',
        title: '🚀 Q3 Launch Checklist',
        content: `### Q3 Deliverables\n\n1. [x] Setup database models\n2. [x] Write seed scripts\n3. [ ] Implement beautiful UI widgets\n4. [ ] Build Chrome extension manifest V3\n5. [ ] Release beta to core team`,
        isShared: true,
        userId: '4',
        updatedAt: new Date().toISOString(),
        user: { id: '4', name: 'Alice Johnson', avatar: 'avatar-4' }
      },
      {
        id: 'n3',
        title: 'Private: Coffee orders & receipts',
        content: `- Espresso for John\n- Double Macchiato for Sarah\n- Iced Latte for Alice`,
        isShared: false,
        userId: '2',
        updatedAt: new Date().toISOString(),
        user: { id: '2', name: 'John Doe', avatar: 'avatar-2' }
      }
    ];
    setNotes(mockNotes);
    setSelectedNote(mockNotes[0]);

    const mockTasks: Task[] = [
      {
        id: 't1',
        title: 'Design sleek glassmorphism UI dashboard',
        description: 'Create the primary dashboard layout with blur effects, vibrant dark/light toggle and custom icons.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: null,
        creatorId: '1',
        assigneeId: '4',
        assignee: mockUsers[3],
        creator: mockUsers[0]
      },
      {
        id: 't2',
        title: 'Deploy backend API to staging server',
        description: 'Host the NestJS SQLite backend and expose public port with proper SSL.',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: null,
        creatorId: '1',
        assigneeId: '2',
        assignee: mockUsers[1],
        creator: mockUsers[0]
      },
      {
        id: 't3',
        title: 'Write project README and onboarding documentation',
        description: 'Detailed steps to install and load the extension in developer mode.',
        status: 'TODO',
        priority: 'LOW',
        dueDate: null,
        creatorId: '3',
        assigneeId: '1',
        assignee: mockUsers[0],
        creator: mockUsers[2]
      }
    ];
    setTasks(mockTasks);

    const mockReminders: Reminder[] = [
      { id: 'r1', text: 'Submit weekly timesheet before Friday 5 PM', dueDate: new Date(Date.now() + 86400000).toISOString(), isCompleted: false, userId: '2' },
      { id: 'r2', text: 'Review Alice\'s pull request for widgets', dueDate: new Date(Date.now() + 14400000).toISOString(), isCompleted: false, userId: '2' }
    ];
    setReminders(mockReminders);

    const mockMessages: Message[] = [
      { id: 'm1', text: 'Hey team! Welcome to SyncTab. Feel free to chat and share notes here!', userId: '1', createdAt: new Date().toISOString(), user: mockUsers[0] },
      { id: 'm2', text: 'Thanks Sarah! The real-time updates are working incredibly fast.', userId: '2', createdAt: new Date().toISOString(), user: mockUsers[1] }
    ];
    setMessages(mockMessages);
  };

  // ==================== API FETCHERS ====================

  const fetchNotes = async (user = currentUser) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/notes?userId=${user.id}`);
      const data = await res.json();
      setNotes(data);
      if (data.length > 0 && !selectedNote) {
        setSelectedNote(data[0]);
      }
    } catch (e) { console.error(e); }
  };

  const fetchBookmarks = async (user = currentUser) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/bookmarks?userId=${user.id}`);
      const data = await res.json();
      setBookmarks(data);
    } catch (e) { console.error(e); }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (e) { console.error(e); }
  };

  const fetchReminders = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_BASE}/reminders?userId=${currentUser.id}`);
      const data = await res.json();
      setReminders(data);
    } catch (e) { console.error(e); }
  };

  const fetchChatMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/messages`);
      const data = await res.json();
      setMessages(data);
      scrollToBottom();
    } catch (e) { console.error(e); }
  };

  // ==================== AUTHENTICATION HANDLERS ====================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (!isOnline) {
        // Offline login simulation
        if (authEmail === 'john@office.com') {
          const mockUser = users.find((u) => u.email === authEmail) || users[0] || {
            id: '2', name: 'John Doe', email: 'john@office.com', avatar: 'avatar-2', status: 'Active'
          };
          localStorage.setItem('synctab_user', JSON.stringify(mockUser));
          setCurrentUser(mockUser);
          setupMockData();
          return;
        } else {
          throw new Error('Offline Mode: Only "john@office.com" is available as a mock email.');
        }
      }

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Invalid email or password');
      }

      const userData = await res.json();
      localStorage.setItem('synctab_user', JSON.stringify(userData));
      setCurrentUser(userData);
      
      // Load user data
      await Promise.all([
        fetchNotes(userData),
        fetchBookmarks(userData),
        fetchTasks(),
        fetchChatMessages()
      ]);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Login failed';
      setAuthError(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (!isOnline) {
        throw new Error('Database is offline. Registration is disabled.');
      }

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authName,
          email: authEmail,
          password: authPassword,
          avatar: authAvatar,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }

      const userData = await res.json();
      localStorage.setItem('synctab_user', JSON.stringify(userData));
      setCurrentUser(userData);

      // Refresh users list
      const resUsers = await fetch(`${API_BASE}/users`);
      if (resUsers.ok) {
        setUsers(await resUsers.json());
      }
      
      await Promise.all([
        fetchNotes(userData),
        fetchBookmarks(userData),
        fetchTasks(),
        fetchChatMessages()
      ]);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Registration failed';
      setAuthError(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLoginClick = () => {
    setAuthError('');
    setAuthLoading(true);

    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${API_BASE}/auth/google/login`,
      'google-oauth',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
    );

    if (!popup) {
      setAuthLoading(false);
      setAuthError('Popup blocked. Please allow popups for Google Sign-In.');
      return;
    }

    const handleMessage = async (event: MessageEvent) => {
      try {
        const apiOrigin = new URL(API_BASE).origin;
        if (event.origin !== apiOrigin) return;
      } catch (e) {
        return;
      }

      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const userData = event.data.user;
        localStorage.setItem('synctab_user', JSON.stringify(userData));
        setCurrentUser(userData);

        try {
          // Refresh users list
          const resUsers = await fetch(`${API_BASE}/users`);
          if (resUsers.ok) {
            setUsers(await resUsers.json());
          }

          // Fetch app data for the logged in user
          await Promise.all([
            fetchNotes(userData),
            fetchBookmarks(userData),
            fetchTasks(),
            fetchChatMessages()
          ]);
        } catch (err) {
          console.error(err);
        }
        
        setAuthLoading(false);
        window.removeEventListener('message', handleMessage);
      } else if (event.data?.type === 'GOOGLE_AUTH_FAILURE') {
        const errMsg = event.data.error || 'Google Sign-In failed.';
        if (errMsg.includes('not configured')) {
          // Fall back to simulated login dialog
          setIsGoogleSimOpen(true);
        } else {
          setAuthError(errMsg);
        }
        setAuthLoading(false);
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        setAuthLoading(false);
        window.removeEventListener('message', handleMessage);
      }
    }, 1000);
  };

  const handleGoogleLogin = async (email: string, name: string, avatar: string) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      if (!isOnline) {
        // Offline Google Login simulation
        const mockUser = {
          id: `google-${Date.now()}`,
          name,
          email,
          avatar,
          status: 'Active'
        };
        localStorage.setItem('synctab_user', JSON.stringify(mockUser));
        setCurrentUser(mockUser);
        return;
      }

      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Google login failed');
      }

      const userData = await res.json();
      localStorage.setItem('synctab_user', JSON.stringify(userData));
      setCurrentUser(userData);

      // Refresh users list
      const resUsers = await fetch(`${API_BASE}/users`);
      if (resUsers.ok) {
        setUsers(await resUsers.json());
      }

      await Promise.all([
        fetchNotes(),
        fetchBookmarks(),
        fetchTasks(),
        fetchChatMessages()
      ]);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Google Login failed';
      setAuthError(errMsg);
    } finally {
      setAuthLoading(false);
      setIsGoogleSimOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('synctab_user');
    setCurrentUser(null);
    setSelectedNote(null);
    setNotes([]);
    setBookmarks([]);
    setTasks([]);
    setReminders([]);
  };

  const handleOfflineDemoLogin = () => {
    const demoUser = {
      id: '2',
      name: 'John Doe',
      email: 'john@office.com',
      avatar: 'avatar-2',
      status: 'Active'
    };
    localStorage.setItem('synctab_user', JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setupMockData();
  };

  // ==================== USER Presences ====================

  const handleStatusChange = async (status: string) => {
    if (!currentUser) return;
    if (!isOnline) {
      // Local fallback
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, status } : u)));
      setCurrentUser((prev) => prev ? { ...prev, status } : null);
      return;
    }
    try {
      await fetch(`${API_BASE}/users/${currentUser.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) { console.error(e); }
  };

  // ==================== BOOKMARK CRUD ====================

  const handleCreateBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newBookmark.title || !newBookmark.url) return;

    if (!isOnline) {
      const b: Bookmark = {
        id: `local-b-${Date.now()}`,
        title: newBookmark.title,
        url: newBookmark.url,
        category: newBookmark.category,
        clicks: 0,
        isShared: newBookmark.isShared,
        userId: currentUser.id
      };
      setBookmarks((prev) => [b, ...prev]);
      setIsBookmarkModalOpen(false);
      setNewBookmark({ title: '', url: '', category: 'Work', isShared: true });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newBookmark.title,
          url: newBookmark.url,
          category: newBookmark.category,
          isShared: newBookmark.isShared,
          userId: currentUser.id
        })
      });
      if (res.ok) {
        setIsBookmarkModalOpen(false);
        setNewBookmark({ title: '', url: '', category: 'Work', isShared: true });
        fetchBookmarks();
      }
    } catch (e) { console.error(e); }
  };

  const handleBookmarkClick = async (bookmark: Bookmark) => {
    window.open(bookmark.url, '_blank');
    if (!isOnline) {
      setBookmarks((prev) => prev.map((b) => (b.id === bookmark.id ? { ...b, clicks: b.clicks + 1 } : b)));
      return;
    }
    try {
      await fetch(`${API_BASE}/bookmarks/${bookmark.id}/click`, { method: 'POST' });
    } catch (e) { console.error(e); }
  };

  const handleDeleteBookmark = async (bookmarkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOnline) {
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      return;
    }
    try {
      await fetch(`${API_BASE}/bookmarks/${bookmarkId}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
  };

  // ==================== NOTES CRUD ====================

  const handleCreateNote = async () => {
    if (!currentUser) return;
    const placeholderTitle = 'Untitled Note';
    const placeholderContent = 'Write your thoughts here...';

    if (!isOnline) {
      const n: Note = {
        id: `local-n-${Date.now()}`,
        title: placeholderTitle,
        content: placeholderContent,
        isShared: false,
        userId: currentUser.id,
        updatedAt: new Date().toISOString(),
        user: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar }
      };
      setNotes((prev) => [n, ...prev]);
      setSelectedNote(n);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: placeholderTitle,
          content: placeholderContent,
          isShared: false,
          userId: currentUser.id
        })
      });
      if (res.ok) {
        const data = await res.json();
        setNotes((prev) => [data, ...prev]);
        setSelectedNote(data);
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateNote = async () => {
    if (!selectedNote) return;
    setNoteSavingStatus('saving');
    
    if (!isOnline) {
      setNotes((prev) => prev.map((n) => (n.id === selectedNote.id ? selectedNote : n)));
      setNoteSavingStatus('saved');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/notes/${selectedNote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedNote.title,
          content: selectedNote.content,
          isShared: selectedNote.isShared
        })
      });
      if (res.ok) {
        setNoteSavingStatus('saved');
      }
    } catch (e) {
      console.error(e);
      setNoteSavingStatus('dirty');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!isOnline) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
      return;
    }
    try {
      await fetch(`${API_BASE}/notes/${noteId}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
  };

  // ==================== TASK CRUD ====================

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newTask.title) return;

    if (!isOnline) {
      const assigneeUser = users.find((u) => u.id === newTask.assigneeId) || null;
      const t: Task = {
        id: `local-t-${Date.now()}`,
        title: newTask.title,
        description: newTask.description || '',
        status: 'TODO',
        priority: newTask.priority,
        dueDate: newTask.dueDate || null,
        creatorId: currentUser.id,
        assigneeId: newTask.assigneeId || null,
        assignee: assigneeUser,
        creator: currentUser
      };
      setTasks((prev) => [t, ...prev]);
      setIsTaskModalOpen(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', assigneeId: '', dueDate: '' });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          status: 'TODO',
          priority: newTask.priority,
          creatorId: currentUser.id,
          assigneeId: newTask.assigneeId || undefined,
          dueDate: newTask.dueDate || undefined
        })
      });
      if (res.ok) {
        setIsTaskModalOpen(false);
        setNewTask({ title: '', description: '', priority: 'MEDIUM', assigneeId: '', dueDate: '' });
        fetchTasks();
      }
    } catch (e) { console.error(e); }
  };

  const handleTaskStatusMove = async (task: Task, nextStatus: string) => {
    if (!isOnline) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
      return;
    }
    try {
      await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (e) { console.error(e); }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!isOnline) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      return;
    }
    try {
      await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
  };

  // ==================== REMINDERS CRUD ====================

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newReminderText || !newReminderTime) return;

    if (!isOnline) {
      const r: Reminder = {
        id: `local-r-${Date.now()}`,
        text: newReminderText,
        dueDate: new Date(newReminderTime).toISOString(),
        isCompleted: false,
        userId: currentUser.id
      };
      setReminders((prev) => [...prev, r].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
      setNewReminderText('');
      setNewReminderTime('');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newReminderText,
          dueDate: new Date(newReminderTime).toISOString(),
          userId: currentUser.id
        })
      });
      if (res.ok) {
        setNewReminderText('');
        setNewReminderTime('');
        fetchReminders();
      }
    } catch (e) { console.error(e); }
  };

  const handleToggleReminder = async (reminderId: string) => {
    if (!isOnline) {
      setReminders((prev) => prev.map((r) => (r.id === reminderId ? { ...r, isCompleted: !r.isCompleted } : r)));
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/reminders/${reminderId}`, { method: 'PATCH' });
      if (res.ok) {
        fetchReminders();
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!isOnline) {
      setReminders((prev) => prev.filter((r) => r.id !== reminderId));
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/reminders/${reminderId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchReminders();
      }
    } catch (e) { console.error(e); }
  };

  // ==================== LIVE CHAT ====================

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !chatMessage.trim()) return;

    if (!isOnline) {
      const m: Message = {
        id: `local-m-${Date.now()}`,
        text: chatMessage,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        user: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar }
      };
      setMessages((prev) => [...prev, m]);
      setChatMessage('');
      scrollToBottom();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: chatMessage,
          userId: currentUser.id
        })
      });
      if (res.ok) {
        setChatMessage('');
      }
    } catch (e) { console.error(e); }
  };

  // Filters bookmarks categories
  const bookmarkCategories = ['All', ...Array.from(new Set(bookmarks.map((b) => b.category)))];
  const filteredBookmarks = bookmarks.filter((b) => {
    if (selectedBookmarkCat === 'All') return true;
    return b.category === selectedBookmarkCat;
  });

  if (loading) {
    return (
      <div className="auth-screen-container">
        <div className="auth-card" style={{ maxWidth: '320px', alignItems: 'center', textAlign: 'center' }}>
          <div className="auth-logo-icon">
            <BookmarkIcon size={24} />
          </div>
          <h2 className="auth-title">SyncTab</h2>
          <p className="auth-subtitle">Loading workspace...</p>
          <div className="loading-spinner" style={{ border: '2px solid rgba(255,255,255,0.05)', borderTop: '2px solid var(--primary)', borderRadius: '50%', width: '24px', height: '24px', animation: 'spin 1s linear infinite', marginTop: '10px' }} />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="auth-screen-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo-icon">
              <BookmarkIcon size={26} />
            </div>
            <h2 className="auth-title">SyncTab</h2>
            <p className="auth-subtitle">Empower your office tab workflow</p>
          </div>

          <div className="auth-tabs">
            <button
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setAuthError(''); }}
              className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
            >
              Register
            </button>
          </div>

          {authError && (
            <div className="auth-error-banner">
              <X size={14} style={{ flexShrink: 0 }} />
              <span>{authError}</span>
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-input-group">
                <label className="auth-input-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="auth-input-field"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>
              <div className="auth-input-group">
                <label className="auth-input-label">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="auth-input-field"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>

              <button type="submit" disabled={authLoading} className="btn-primary" style={{ padding: '12px', marginTop: '8px', fontSize: '13px', width: '100%' }}>
                {authLoading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="divider-container">Or Connect With</div>

              <button
                type="button"
                onClick={handleGoogleLoginClick}
                className="google-auth-btn"
                style={{ width: '100%' }}
              >
                <svg className="google-icon-svg" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.48 7.58l3.96 3.07C6.39 7.42 9.01 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.44 14.78c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.48 7.15C.53 9.07 0 11.22 0 13.5s.53 4.43 1.48 6.35l3.96-3.07z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.1.74-2.51 1.18-4.23 1.18-2.99 0-5.61-2.38-6.56-5.61l-3.96 3.07C3.37 20.32 7.35 23 12 23z"
                  />
                </svg>
                Continue with Google
              </button>

              {!isOnline && (
                <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={handleOfflineDemoLogin}
                    className="btn-secondary"
                    style={{ width: '100%', padding: '10px', fontSize: '12px' }}
                  >
                    Enter Offline Demo Mode
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-input-group">
                <label className="auth-input-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="auth-input-field"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                />
              </div>
              <div className="auth-input-group">
                <label className="auth-input-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@company.com"
                  className="auth-input-field"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>
              <div className="auth-input-group">
                <label className="auth-input-label">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Create password"
                  className="auth-input-field"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>
              <div className="auth-input-group">
                <label className="auth-input-label">Select Avatar</label>
                <div className="auth-avatar-grid">
                  {['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5', 'avatar-6', 'avatar-7', 'avatar-8'].map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAuthAvatar(av)}
                      className={`auth-avatar-option ${authAvatar === av ? 'selected' : ''}`}
                    >
                      <div className={`avatar-circle ${av}`} style={{ width: '36px', height: '36px', fontSize: '12px', cursor: 'pointer' }}>
                        {authName ? authName.charAt(0) : 'A'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={authLoading} className="btn-primary" style={{ padding: '12px', marginTop: '12px', fontSize: '13px', width: '100%' }}>
                {authLoading ? 'Creating Account...' : 'Register Account'}
              </button>
            </form>
          )}
        </div>

        {/* MOCK GOOGLE LOGIN DIALOG SIMULATION */}
        {isGoogleSimOpen && (
          <div className="google-sim-modal-overlay">
            <div className="google-sim-card">
              <div className="google-sim-header">
                <svg className="google-icon-svg" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.48 7.58l3.96 3.07C6.39 7.42 9.01 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.44 14.78c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.48 7.15C.53 9.07 0 11.22 0 13.5s.53 4.43 1.48 6.35l3.96-3.07z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.1.74-2.51 1.18-4.23 1.18-2.99 0-5.61-2.38-6.56-5.61l-3.96 3.07C3.37 20.32 7.35 23 12 23z"
                  />
                </svg>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginTop: '8px' }}>Sign in with Google</h3>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Choose a simulated account to connect to SyncTab</p>
              </div>

              <div className="google-sim-accounts">
                {[
                  { name: 'Sarah Connor', email: 'sarah@skynet.com', avatar: 'avatar-1', bg: '#fee2e2', text: '#991b1b' },
                  { name: 'John Doe', email: 'john@office.com', avatar: 'avatar-2', bg: '#dbeafe', text: '#1e40af' },
                  { name: 'Jane Smith', email: 'jane@corporate.com', avatar: 'avatar-3', bg: '#fef3c7', text: '#92400e' },
                  { name: 'Alice Johnson', email: 'alice@design.com', avatar: 'avatar-4', bg: '#f3e8ff', text: '#6b21a8' }
                ].map((acc) => (
                  <div
                    key={acc.email}
                    onClick={() => handleGoogleLogin(acc.email, acc.name, acc.avatar)}
                    className="google-sim-account-row"
                  >
                    <div className="google-sim-avatar" style={{ background: acc.bg, color: acc.text }}>
                      {acc.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{acc.name}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>{acc.email}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="google-sim-custom-form">
                <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Or simulated custom Google login</div>
                <input
                  type="email"
                  placeholder="enter.any.email@gmail.com"
                  className="auth-input-field"
                  style={{ background: '#f9fafb', color: '#111827', border: '1px solid #d1d5db', padding: '8px 12px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      const email = e.currentTarget.value;
                      const parts = email.split('@');
                      const name = parts[0].split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
                      handleGoogleLogin(email, name, 'avatar-5');
                    }
                  }}
                />
                <div style={{ fontSize: '10px', color: '#9ca3af', fontStyle: 'italic' }}>Press Enter to submit custom Google email</div>
              </div>

              <button
                type="button"
                onClick={() => setIsGoogleSimOpen(false)}
                className="btn-secondary"
                style={{ width: '100%', background: '#f3f4f6', color: '#374151', padding: '10px', fontSize: '12px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* 1. Sidebar Nav */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="logo-icon">
            <BookmarkIcon size={20} />
          </div>
          <span className="brand-name">SyncTab</span>
        </div>

        {/* User Simulation Selector */}
        {currentUser && (
          <div className="user-selector-card glass-panel">
            <div className="user-profile-info">
              <div className={`avatar-circle ${currentUser.avatar}`}>
                {currentUser.name.charAt(0)}
                <span className={`status-dot ${currentUser.status.toLowerCase().replace(' ', '')}`} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700 }}>{currentUser.name}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Teammate</p>
              </div>
            </div>

            {/* Quick Status picker */}
            <div className="presence-picker">
              {['Active', 'Away', 'Meeting', 'Busy'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`presence-btn ${currentUser.status.toLowerCase().includes(st.toLowerCase()) ? 'selected' : ''}`}
                >
                  {st}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
              <button
                onClick={handleLogout}
                className="btn-signout"
                style={{
                  width: '100%',
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  background: 'rgba(244, 63, 94, 0.08)',
                  color: 'var(--color-meeting)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <Globe size={16} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('bookmarks')} className={`nav-item ${activeTab === 'bookmarks' ? 'active' : ''}`}>
            <BookmarkIcon size={16} /> Custom Bookmarks
          </button>
          <button onClick={() => setActiveTab('notes')} className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`}>
            <FileText size={16} /> Shared & Personal Notes
          </button>
          <button onClick={() => setActiveTab('tasks')} className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}>
            <CheckSquare size={16} /> Issue / Task Kanban
          </button>
          <button onClick={() => setActiveTab('reminders')} className={`nav-item ${activeTab === 'reminders' ? 'active' : ''}`}>
            <Clock size={16} /> Quick Reminders
          </button>
        </nav>

        {/* Live Chat Panel in Sidebar */}
        <div className="sidebar-chat">
          <div className="chat-header">
            <span style={{ fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={14} color="var(--primary)" /> Team Workspace Chat
            </span>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className="chat-bubble">
                <div className="chat-user">
                  <span>{msg.user?.name || 'Teammate'}</span>
                  <span className="chat-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendChatMessage} className="chat-input-wrapper">
            <input
              type="text"
              className="chat-input"
              placeholder="Post an update..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <ChevronRight size={14} />
            </button>
          </form>
        </div>
      </aside>

      {/* 2. Main Dashboard Panel */}
      <main className="main-content">
        {/* Top Header widgets */}
        <header className="dashboard-header">
          <div>
            <span style={{
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '20px',
              fontWeight: 600,
              background: isOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              color: isOnline ? 'var(--color-active)' : 'var(--color-meeting)',
              border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px'
            }}>
              <span className={`status-dot ${isOnline ? 'active' : 'meeting'}`} style={{ position: 'relative', border: 'none' }} />
              {isOnline ? 'Real-time Connected' : 'Offline Mode (Local Sim)'}
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.7px' }}>
              Welcome back, {currentUser?.name || 'Worker'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Simplify your office workflow. Share tasks, bookmarks, and coordinate effortlessly.
            </p>
          </div>

          <div className="time-widget">
            <div className="time-display">{timeStr}</div>
            <div className="date-display">{dateStr}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button className="btn-icon-only" onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading Workspace...</span>
          </div>
        ) : (
          <>
            {/* Navigated Tabs */}
            
            {/* A. DASHBOARD VIEW (All modules summarized in widget grid) */}
            {activeTab === 'dashboard' && (
              <div className="widgets-grid">
                
                {/* 1. Bookmark Widget (Summarized) */}
                <div className="widget-container glass-panel widget-span-8">
                  <div className="widget-header-row">
                    <h3 className="widget-title">
                      <BookmarkIcon size={18} color="var(--primary)" /> Quick Launch Bookmarks
                    </h3>
                    <button className="btn-primary" onClick={() => setIsBookmarkModalOpen(true)}>
                      <Plus size={14} /> Add New
                    </button>
                  </div>

                  <div className="bookmarks-container">
                    <div className="bookmarks-grid">
                      {bookmarks.slice(0, 8).map((bookmark) => (
                        <div
                          key={bookmark.id}
                          className="bookmark-card"
                          onClick={() => handleBookmarkClick(bookmark)}
                        >
                          {bookmark.isShared && <span className="bookmark-shared-tag">Shared</span>}
                          <button
                            className="bookmark-delete-btn"
                            onClick={(e) => handleDeleteBookmark(bookmark.id, e)}
                          >
                            <Trash2 size={12} />
                          </button>
                          <div className="bookmark-icon-box">
                            {bookmark.title.charAt(0).toUpperCase()}
                          </div>
                          <div className="bookmark-title">{bookmark.title}</div>
                          <div className="bookmark-clicks">{bookmark.clicks} clicks</div>
                        </div>
                      ))}
                      {bookmarks.length === 0 && (
                        <div className="empty-state widget-span-12">
                          <span className="empty-state-icon">🌟</span>
                          <span>No bookmarks saved yet. Customise your dashboard.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Team Directory / Status Widget */}
                <div className="widget-container glass-panel widget-span-4">
                  <h3 className="widget-title">
                    <Users size={18} color="var(--secondary)" /> Teammates Status
                  </h3>
                  <div className="teammates-grid">
                    {users.map((u) => (
                      <div key={u.id} className="teammate-row">
                        <div className="teammate-info">
                          <div className={`avatar-circle ${u.avatar}`} style={{ width: '32px', height: '32px', fontSize: '13px' }}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="teammate-name">{u.name}</div>
                            <div className="teammate-status-label">{u.email || 'Workspace user'}</div>
                          </div>
                        </div>
                        <span className={`teammate-presence-badge ${u.status.toLowerCase().replace(' ', '')}`}>
                          {u.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Notes Widget (Quick access) */}
                <div className="widget-container glass-panel widget-span-6">
                  <div className="widget-header-row">
                    <h3 className="widget-title">
                      <FileText size={18} color="var(--primary)" /> Shared Team Notes
                    </h3>
                    <button className="btn-secondary" onClick={() => { setActiveTab('notes'); handleCreateNote(); }}>
                      <Plus size={14} /> New Note
                    </button>
                  </div>
                  <div className="notes-list" style={{ maxHeight: '250px' }}>
                    {notes.filter(n => n.isShared).slice(0, 4).map((note) => (
                      <div
                        key={note.id}
                        className="note-item"
                        onClick={() => { setSelectedNote(note); setActiveTab('notes'); }}
                      >
                        <div className="note-item-title">{note.title}</div>
                        <div className="note-item-meta">
                          <span>Updated by {note.user?.name || 'Teammate'}</span>
                          <span className="note-shared-badge">Shared</span>
                        </div>
                      </div>
                    ))}
                    {notes.filter(n => n.isShared).length === 0 && (
                      <div className="empty-state">
                        <span>No shared notes yet. Share a note to coordinate designs.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Reminders Widget (Personal) */}
                <div className="widget-container glass-panel widget-span-6">
                  <h3 className="widget-title">
                    <Clock size={18} color="var(--secondary)" /> My Reminders
                  </h3>
                  
                  <form onSubmit={handleCreateReminder} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add reminders (e.g. Timesheet review)"
                      value={newReminderText}
                      onChange={(e) => setNewReminderText(e.target.value)}
                    />
                    <input
                      type="datetime-local"
                      className="form-input"
                      style={{ maxWidth: '160px' }}
                      value={newReminderTime}
                      onChange={(e) => setNewReminderTime(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">Add</button>
                  </form>

                  <div className="reminders-list">
                    {reminders.map((rem) => (
                      <div key={rem.id} className="reminder-item">
                        <div className="reminder-content">
                          <button
                            className={`reminder-checkbox ${rem.isCompleted ? 'checked' : ''}`}
                            onClick={() => handleToggleReminder(rem.id)}
                          >
                            {rem.isCompleted && <Check size={12} />}
                          </button>
                          <div>
                            <div className={`reminder-text ${rem.isCompleted ? 'completed' : ''}`}>
                              {rem.text}
                            </div>
                            <div className="reminder-date">
                              {new Date(rem.dueDate).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <button className="reminder-delete-btn" onClick={() => handleDeleteReminder(rem.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    {reminders.length === 0 && (
                      <div className="empty-state">
                        <span>No upcoming reminders for your workspace.</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* B. DETAILED BOOKMARKS VIEW */}
            {activeTab === 'bookmarks' && (
              <div className="widget-container glass-panel">
                <div className="widget-header-row">
                  <div>
                    <h3 className="widget-title"><BookmarkIcon size={20} color="var(--primary)" /> Manage Bookmarks</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Add personal bookmarks or share useful URLs with your workspace team.
                    </p>
                  </div>
                  <button className="btn-primary" onClick={() => setIsBookmarkModalOpen(true)}>
                    <Plus size={16} /> Add Bookmark
                  </button>
                </div>

                <div className="bookmark-tabs">
                  {bookmarkCategories.map((cat) => (
                    <button
                      key={cat}
                      className={`bookmark-tab ${selectedBookmarkCat === cat ? 'active' : ''}`}
                      onClick={() => setSelectedBookmarkCat(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="bookmarks-grid">
                  {filteredBookmarks.map((b) => (
                    <div
                      key={b.id}
                      className="bookmark-card"
                      onClick={() => handleBookmarkClick(b)}
                      style={{ minHeight: '140px' }}
                    >
                      {b.isShared && <span className="bookmark-shared-tag">Shared</span>}
                      <button
                        className="bookmark-delete-btn"
                        onClick={(e) => handleDeleteBookmark(b.id, e)}
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="bookmark-icon-box">
                        <Globe size={18} />
                      </div>
                      <div className="bookmark-title">{b.title}</div>
                      <div className="bookmark-clicks" style={{ fontSize: '11px' }}>{b.category} • {b.clicks} clicks</div>
                    </div>
                  ))}
                  {filteredBookmarks.length === 0 && (
                    <div className="empty-state widget-span-12">
                      <span className="empty-state-icon">📂</span>
                      <span>No bookmarks found in this category.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* C. DETAILED NOTES VIEW */}
            {activeTab === 'notes' && (
              <div className="widget-container glass-panel">
                <div className="widget-header-row">
                  <div>
                    <h3 className="widget-title"><FileText size={20} color="var(--primary)" /> Workspace Notes</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Private notes are visible only to you. Shared notes sync in real-time with teammates.
                    </p>
                  </div>
                  <button className="btn-primary" onClick={handleCreateNote}>
                    <Plus size={16} /> New Note
                  </button>
                </div>

                <div className="notes-layout">
                  {/* Left Side Note list */}
                  <div className="notes-list">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                        onClick={() => setSelectedNote(note)}
                      >
                        <div className="note-item-title">{note.title}</div>
                        <div className="note-item-meta">
                          <span>By {note.user?.name || 'Teammate'}</span>
                          {note.isShared && <span className="note-shared-badge">Shared</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Side Note Editor */}
                  {selectedNote ? (
                    <div className="notes-editor">
                      <input
                        type="text"
                        className="note-title-input"
                        value={selectedNote.title}
                        onChange={(e) => {
                          setSelectedNote({ ...selectedNote, title: e.target.value });
                          setNoteSavingStatus('dirty');
                        }}
                      />
                      <textarea
                        className="note-textarea"
                        placeholder="Write note contents... Supports standard text formatting."
                        value={selectedNote.content}
                        onChange={(e) => {
                          setSelectedNote({ ...selectedNote, content: e.target.value });
                          setNoteSavingStatus('dirty');
                        }}
                      />
                      <div className="note-editor-footer">
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <label className="form-checkbox-row">
                            <input
                              type="checkbox"
                              checked={selectedNote.isShared}
                              onChange={(e) => {
                                setSelectedNote({ ...selectedNote, isShared: e.target.checked });
                                setNoteSavingStatus('dirty');
                              }}
                            />
                            Share with team
                          </label>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {noteSavingStatus === 'saving' && 'Saving updates...'}
                            {noteSavingStatus === 'saved' && 'Draft Saved'}
                            {noteSavingStatus === 'dirty' && 'Unsaved changes'}
                          </span>
                          <button className="btn-primary" onClick={handleUpdateNote}>
                            <Save size={14} /> Save Note
                          </button>
                          <button
                            className="btn-secondary"
                            style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--color-meeting)', border: '1px solid rgba(244, 63, 94, 0.2)' }}
                            onClick={() => handleDeleteNote(selectedNote.id)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state" style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <span className="empty-state-icon">📝</span>
                      <span>Select or create a note on the left panel to begin editing.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* D. DETAILED TASK KANBAN VIEW */}
            {activeTab === 'tasks' && (
              <div className="widget-container glass-panel">
                <div className="widget-header-row">
                  <div>
                    <h3 className="widget-title"><CheckSquare size={20} color="var(--primary)" /> Team Project Kanban</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Assign issues to teammates, prioritize workload, and move tasks across boards.
                    </p>
                  </div>
                  <button className="btn-primary" onClick={() => setIsTaskModalOpen(true)}>
                    <Plus size={16} /> Create Task
                  </button>
                </div>

                <div className="kanban-board">
                  {/* Column 1: TODO */}
                  <div className="kanban-column">
                    <div className="column-header">
                      <span className="column-title"><span className="status-dot" style={{ backgroundColor: 'var(--color-todo)', position: 'relative' }} /> TODO</span>
                      <span className="column-count">{tasks.filter((t) => t.status === 'TODO').length}</span>
                    </div>
                    <div className="tasks-list">
                      {tasks.filter((t) => t.status === 'TODO').map((task) => (
                        <div key={task.id} className="task-card">
                          <button
                            style={{ position: 'absolute', top: '8px', right: '8px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 size={12} />
                          </button>
                          <div className="task-card-title">{task.title}</div>
                          {task.description && <div className="task-card-desc">{task.description}</div>}
                          <div className="task-card-footer">
                            <span className={`task-priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
                            <div className="task-assignee-box">
                              {task.assignee ? (
                                <div className={`task-assignee-avatar ${task.assignee.avatar}`} title={`Assigned to ${task.assignee.name}`}>
                                  {task.assignee.name.charAt(0)}
                                </div>
                              ) : (
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Unassigned</span>
                              )}
                              <button
                                className="btn-secondary"
                                style={{ padding: '2px 6px', fontSize: '9px' }}
                                onClick={() => handleTaskStatusMove(task, 'IN_PROGRESS')}
                              >
                                Start
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: IN_PROGRESS */}
                  <div className="kanban-column">
                    <div className="column-header">
                      <span className="column-title"><span className="status-dot" style={{ backgroundColor: 'var(--color-inprogress)', position: 'relative' }} /> IN PROGRESS</span>
                      <span className="column-count">{tasks.filter((t) => t.status === 'IN_PROGRESS').length}</span>
                    </div>
                    <div className="tasks-list">
                      {tasks.filter((t) => t.status === 'IN_PROGRESS').map((task) => (
                        <div key={task.id} className="task-card">
                          <button
                            style={{ position: 'absolute', top: '8px', right: '8px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 size={12} />
                          </button>
                          <div className="task-card-title">{task.title}</div>
                          {task.description && <div className="task-card-desc">{task.description}</div>}
                          <div className="task-card-footer">
                            <span className={`task-priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
                            <div className="task-assignee-box">
                              {task.assignee && (
                                <div className={`task-assignee-avatar ${task.assignee.avatar}`} title={`Assigned to ${task.assignee.name}`}>
                                  {task.assignee.name.charAt(0)}
                                </div>
                              )}
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  className="btn-secondary"
                                  style={{ padding: '2px 6px', fontSize: '9px' }}
                                  onClick={() => handleTaskStatusMove(task, 'TODO')}
                                >
                                  Reset
                                </button>
                                <button
                                  className="btn-primary"
                                  style={{ padding: '2px 6px', fontSize: '9px' }}
                                  onClick={() => handleTaskStatusMove(task, 'DONE')}
                                >
                                  Finish
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: DONE */}
                  <div className="kanban-column">
                    <div className="column-header">
                      <span className="column-title"><span className="status-dot" style={{ backgroundColor: 'var(--color-done)', position: 'relative' }} /> DONE</span>
                      <span className="column-count">{tasks.filter((t) => t.status === 'DONE').length}</span>
                    </div>
                    <div className="tasks-list">
                      {tasks.filter((t) => t.status === 'DONE').map((task) => (
                        <div key={task.id} className="task-card" style={{ opacity: 0.75 }}>
                          <button
                            style={{ position: 'absolute', top: '8px', right: '8px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 size={12} />
                          </button>
                          <div className="task-card-title" style={{ textDecoration: 'line-through' }}>{task.title}</div>
                          {task.description && <div className="task-card-desc">{task.description}</div>}
                          <div className="task-card-footer">
                            <span className={`task-priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
                            <div className="task-assignee-box">
                              {task.assignee && (
                                <div className={`task-assignee-avatar ${task.assignee.avatar}`} title={`Assigned to ${task.assignee.name}`}>
                                  {task.assignee.name.charAt(0)}
                                </div>
                              )}
                              <button
                                className="btn-secondary"
                                style={{ padding: '2px 6px', fontSize: '9px' }}
                                onClick={() => handleTaskStatusMove(task, 'IN_PROGRESS')}
                              >
                                Reopen
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* E. DETAILED REMINDERS VIEW */}
            {activeTab === 'reminders' && (
              <div className="widget-container glass-panel" style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
                <div>
                  <h3 className="widget-title"><Clock size={20} color="var(--primary)" /> Task Reminders</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Setup alert triggers for deadlines, team presentations or meetings.
                  </p>
                </div>

                <form onSubmit={handleCreateReminder} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Reminder Text</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Standup presentation preparation"
                      value={newReminderText}
                      onChange={(e) => setNewReminderText(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trigger Time</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={newReminderTime}
                      onChange={(e) => setNewReminderTime(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                    <Plus size={14} /> Add Reminder
                  </button>
                </form>

                <div className="reminders-list" style={{ marginTop: '20px', maxHeight: 'none' }}>
                  {reminders.map((rem) => (
                    <div key={rem.id} className="reminder-item">
                      <div className="reminder-content">
                        <button
                          className={`reminder-checkbox ${rem.isCompleted ? 'checked' : ''}`}
                          onClick={() => handleToggleReminder(rem.id)}
                        >
                          {rem.isCompleted && <Check size={12} />}
                        </button>
                        <div>
                          <div className={`reminder-text ${rem.isCompleted ? 'completed' : ''}`}>
                            {rem.text}
                          </div>
                          <div className="reminder-date">
                            Scheduled: {new Date(rem.dueDate).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <button className="reminder-delete-btn" onClick={() => handleDeleteReminder(rem.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {reminders.length === 0 && (
                    <div className="empty-state">
                      <span className="empty-state-icon">🔔</span>
                      <span>No reminders scheduled for this profile.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ==================== MODALS ==================== */}

      {/* 1. Bookmark Modal */}
      {isBookmarkModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Add Launch Bookmark</h3>
              <button className="modal-close" onClick={() => setIsBookmarkModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateBookmark} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Office Outlook"
                  value={newBookmark.title}
                  onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://outlook.office.com"
                  value={newBookmark.url}
                  onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newBookmark.category}
                    onChange={(e) => setNewBookmark({ ...newBookmark, category: e.target.value })}
                  >
                    <option value="Work">Work</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Tech News">Tech News</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-checkbox-row">
                  <input
                    type="checkbox"
                    checked={newBookmark.isShared}
                    onChange={(e) => setNewBookmark({ ...newBookmark, isShared: e.target.checked })}
                  />
                  Share with teammates dashboard
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsBookmarkModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Bookmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Task Modal */}
      {isTaskModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Create Project Task</h3>
              <button className="modal-close" onClick={() => setIsTaskModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Write API endpoints documentation"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Provide task specifics or checklists..."
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select
                    className="form-select"
                    value={newTask.assigneeId}
                    onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsTaskModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
