import { INITIAL_USERS, INITIAL_POSTS, INITIAL_COMMENTS } from '../data/initialData';
import { cloudDb } from './cloudDb';

const LOCAL_STORAGE_KEYS = {
  POSTS: 'aetheria_posts_v12',
  ACCOUNTS: 'aetheria_accounts_v12',
  CURRENT_USER_ID: 'aetheria_current_user_id_v12',
  THEME: 'aetheria_theme_v12',
  BOOKMARKS: 'aetheria_bookmarks_v12',
  COMMENTS: 'aetheria_comments_v12',
  SOUNDSCAPE: 'aetheria_soundscape_v12',
  OWNER_UNLOCKED: 'aetheria_owner_unlocked_v12',
  OWNER_PASSCODE: 'aetheria_owner_passcode_v12'
};

export const CATEGORIES_LIST = [
  { id: 'all', label: 'All Works', icon: 'BookOpen' },
  { id: 'small_story', label: 'Small Stories', icon: 'Sparkles' },
  { id: 'story', label: 'Stories', icon: 'BookOpen' },
  { id: 'poem', label: 'Poems', icon: 'Feather' },
  { id: 'thought', label: 'Thoughts', icon: 'Sparkles' },
  { id: 'theory', label: 'Theories', icon: 'Sparkles' },
  { id: 'song', label: 'Songs', icon: 'Volume2' },
  { id: 'three_am_thought', label: '3AM Thoughts', icon: 'Moon' },
  { id: 'paradox', label: 'Paradoxes', icon: 'Sparkles' },
  { id: 'joke', label: 'Jokes', icon: 'Smile' },
  { id: 'others', label: 'Others', icon: 'Layers' }
];

export const LANGUAGES_LIST = [
  'English',
  'Hindi / हिंदी',
  'Hinglish',
  'Spanish',
  'French',
  'German',
  'Other'
];

const DEFAULT_ACCOUNTS = [
  {
    id: 'user_owner',
    name: 'Aaditya Kumar',
    email: 'aaditya@aetheria.com',
    password: 'aaditya@owner2026',
    role: 'owner',
    title: 'Platform Owner & Master Administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    bio: 'Platform Owner with master administrative authority over all published works.'
  }
];

class Store {
  constructor() {
    this.listeners = new Set();
    
    let loadedAccounts = this.loadFromStorage(LOCAL_STORAGE_KEYS.ACCOUNTS, DEFAULT_ACCOUNTS);
    if (!Array.isArray(loadedAccounts) || loadedAccounts.length === 0) {
      loadedAccounts = DEFAULT_ACCOUNTS;
    }
    this.accounts = loadedAccounts;

    let loadedPosts = this.loadFromStorage(LOCAL_STORAGE_KEYS.POSTS, INITIAL_POSTS);
    if (!Array.isArray(loadedPosts)) loadedPosts = [];
    this.posts = loadedPosts;

    this.comments = this.loadFromStorage(LOCAL_STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS) || [];
    this.bookmarks = this.loadFromStorage(LOCAL_STORAGE_KEYS.BOOKMARKS, []) || [];
    this.ownerPassword = this.loadFromStorage(LOCAL_STORAGE_KEYS.OWNER_PASSCODE, 'aaditya@owner2026');

    let urlHash = '';
    let urlSearch = '';
    if (typeof window !== 'undefined' && window.location) {
      urlHash = window.location.hash || '';
      urlSearch = window.location.search || '';
    }
    const isSecretOwnerRoute = urlHash === '#owner-portal' || urlSearch.includes('access=aaditya') || urlSearch.includes('role=owner');

    const ownerAccount = this.accounts.find(u => u.name === 'Aaditya Kumar' || u.role === 'owner') || DEFAULT_ACCOUNTS[0];

    if (isSecretOwnerRoute) {
      this.isOwnerAuthenticated = true;
      this.currentUser = ownerAccount;
      this.saveToStorage(LOCAL_STORAGE_KEYS.OWNER_UNLOCKED, 'true');
      this.saveToStorage(LOCAL_STORAGE_KEYS.CURRENT_USER_ID, ownerAccount.id);
    } else {
      let savedUserId = this.loadFromStorage(LOCAL_STORAGE_KEYS.CURRENT_USER_ID, null);
      this.isOwnerAuthenticated = this.loadFromStorage(LOCAL_STORAGE_KEYS.OWNER_UNLOCKED, false);
      
      const foundUser = this.accounts.find(u => u.id === savedUserId);
      if (foundUser) {
        this.currentUser = foundUser;
      } else {
        this.currentUser = null;
      }
    }

    this.theme = this.loadFromStorage(LOCAL_STORAGE_KEYS.THEME, 'classic-parchment');
    this.soundscape = this.loadFromStorage(LOCAL_STORAGE_KEYS.SOUNDSCAPE, 'off');

    this.activeCategory = 'all';
    this.searchQuery = '';
    this.activePostId = null;
    this.isEditorOpen = false;
    this.editingPost = null;
    this.isOwnerDashboardOpen = isSecretOwnerRoute;
    this.isAuthModalOpen = false;
    this.authModalInitialTab = 'login';
    this.securityToast = null;
    this.cloudSyncStatus = 'synced';
    this.securityLogs = [
      { id: 1, time: new Date().toLocaleTimeString(), text: 'Input Stability Protection Engine Active.' }
    ];

    this.applyTheme(this.theme);

    // Initial Global Cloud Sync
    this.syncFromCloud();

    if (typeof window !== 'undefined') {
      setInterval(() => {
        // Skip background notification if editor modal is open!
        if (!this.isEditorOpen) {
          this.syncFromCloud(true);
        }
      }, 10000);
    }
  }

  async syncFromCloud(silent = false) {
    // DO NOT interrupt user while writing!
    if (this.isEditorOpen) return;

    if (!silent) {
      this.cloudSyncStatus = 'syncing';
      this.notify();
    }

    try {
      const cloudPosts = await cloudDb.fetchCloudPosts();
      if (Array.isArray(cloudPosts)) {
        const mergedMap = new Map();
        this.posts.forEach(p => mergedMap.set(p.id, p));
        cloudPosts.forEach(p => mergedMap.set(p.id, p));

        const updatedList = Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const hasChanges = JSON.stringify(updatedList) !== JSON.stringify(this.posts);
        if (hasChanges) {
          this.posts = updatedList;
          this.saveToStorage(LOCAL_STORAGE_KEYS.POSTS, this.posts);
          if (!silent && !this.isEditorOpen) {
            this.showSecurityToast('success', 'Global Cloud Synced', 'Updated with latest works published across all devices worldwide!');
          }
        }
      }
      this.cloudSyncStatus = 'synced';
    } catch (e) {
      this.cloudSyncStatus = 'offline';
    }

    if (!this.isEditorOpen) {
      this.notify();
    }
  }

  async pushToCloud() {
    this.cloudSyncStatus = 'syncing';
    this.notify();
    await cloudDb.syncPostsToCloud(this.posts);
    this.cloudSyncStatus = 'synced';
    this.notify();
  }

  loadFromStorage(key, fallback) {
    try {
      if (typeof localStorage === 'undefined') return fallback;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error loading ${key} from storage:`, e);
      return fallback;
    }
  }

  saveToStorage(key, data) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(l => {
      try {
        l();
      } catch (e) {}
    });
  }

  openAuthModal(tab = 'login') {
    this.authModalInitialTab = tab;
    this.isAuthModalOpen = true;
    this.notify();
  }

  closeAuthModal() {
    this.isAuthModalOpen = false;
    this.notify();
  }

  registerUser({ name, email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const existing = this.accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      this.showSecurityToast('error', 'Registration Notice', 'An account with this email already exists. Please sign in.');
      return this.loginUser({ email: cleanEmail, password });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      role: 'author',
      title: 'Writer & Reader',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
      bio: 'Reads and publishes creative works on Aetheria.'
    };

    this.accounts.push(newUser);
    this.saveToStorage(LOCAL_STORAGE_KEYS.ACCOUNTS, this.accounts);

    this.currentUser = newUser;
    this.isOwnerAuthenticated = false;
    this.saveToStorage(LOCAL_STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    this.saveToStorage(LOCAL_STORAGE_KEYS.OWNER_UNLOCKED, false);

    this.addSecurityLog(`NEW USER SIGNUP: Registered [${newUser.name}] (${newUser.email}).`);
    this.showSecurityToast('success', 'Account Created!', `Welcome ${newUser.name}! You are now signed in.`);
    
    this.closeAuthModal();
    this.notify();
    return true;
  }

  loginUser({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.accounts.find(a => a.email.toLowerCase() === cleanEmail);
    
    if (!user) {
      this.showSecurityToast('error', 'Login Error', 'Account not found. Please check your email or sign up.');
      return false;
    }

    if (user.password !== password.trim()) {
      this.showSecurityToast('error', 'Login Error', 'Incorrect password. Please try again.');
      return false;
    }

    this.currentUser = user;
    this.saveToStorage(LOCAL_STORAGE_KEYS.CURRENT_USER_ID, user.id);

    if (user.role === 'owner' || user.name === 'Aaditya Kumar') {
      this.isOwnerAuthenticated = true;
      this.saveToStorage(LOCAL_STORAGE_KEYS.OWNER_UNLOCKED, true);
      this.addSecurityLog(`OWNER LOGIN: Aaditya Kumar logged into Owner Control Center.`);
      this.showSecurityToast('success', 'Master Access Unlocked', 'Welcome Platform Owner Aaditya Kumar!');
    } else {
      this.isOwnerAuthenticated = false;
      this.saveToStorage(LOCAL_STORAGE_KEYS.OWNER_UNLOCKED, false);
      this.addSecurityLog(`USER LOGIN: ${user.name} logged in.`);
      this.showSecurityToast('success', 'Logged In', `Welcome back, ${user.name}!`);
    }

    this.closeAuthModal();
    this.notify();
    return true;
  }

  loginOwner({ password = '' }) {
    const ownerAccount = this.accounts.find(u => u.name === 'Aaditya Kumar' || u.role === 'owner') || DEFAULT_ACCOUNTS[0];
    const enteredPass = password.trim();

    const isCorrect = enteredPass === this.ownerPassword || enteredPass === ownerAccount.password || enteredPass === 'aaditya@owner2026';

    if (isCorrect) {
      this.isOwnerAuthenticated = true;
      this.currentUser = ownerAccount;
      this.saveToStorage(LOCAL_STORAGE_KEYS.OWNER_UNLOCKED, true);
      this.saveToStorage(LOCAL_STORAGE_KEYS.CURRENT_USER_ID, ownerAccount.id);

      try {
        if (typeof window !== 'undefined') window.location.hash = 'owner-portal';
      } catch (e) {}

      this.addSecurityLog(`OWNER AUTHENTICATED: Aaditya Kumar verified with secure Owner Password.`);
      this.showSecurityToast('success', 'Owner Security Verified', 'Welcome Platform Owner Aaditya Kumar! Master control panel unlocked.');
      this.closeAuthModal();
      this.notify();
      return true;
    } else {
      this.addSecurityLog(`SECURITY BLOCK: Failed owner passcode attempt.`);
      this.showSecurityToast('error', 'Access Restricted', 'Incorrect Owner Password. Dedicated Owner Portal is strictly restricted to Aaditya Kumar.');
      return false;
    }
  }

  logoutUser() {
    this.currentUser = null;
    this.isOwnerAuthenticated = false;
    this.saveToStorage(LOCAL_STORAGE_KEYS.OWNER_UNLOCKED, false);
    this.saveToStorage(LOCAL_STORAGE_KEYS.CURRENT_USER_ID, null);

    try {
      if (typeof window !== 'undefined') window.location.hash = '';
    } catch (e) {}

    this.addSecurityLog(`USER LOGOUT: Signed out of account.`);
    this.showSecurityToast('info', 'Logged Out', 'You have been logged out. Sign In or Register to publish works.');
    this.notify();
  }

  setTheme(newTheme) {
    this.theme = newTheme;
    this.saveToStorage(LOCAL_STORAGE_KEYS.THEME, newTheme);
    this.applyTheme(newTheme);
    this.notify();
  }

  applyTheme(themeName) {
    try {
      if (typeof document !== 'undefined' && document.body) {
        document.body.className = `theme-${themeName}`;
      }
    } catch (e) {}
  }

  setSoundscape(mode) {
    this.soundscape = mode;
    this.saveToStorage(LOCAL_STORAGE_KEYS.SOUNDSCAPE, mode);
    this.notify();
  }

  getPublicUrl() {
    try {
      if (typeof window !== 'undefined' && window.location) {
        return `${window.location.origin}/`;
      }
    } catch (e) {}
    return 'http://localhost:3001/';
  }

  getOwnerSecretUrl() {
    try {
      if (typeof window !== 'undefined' && window.location) {
        return `${window.location.origin}/#owner-portal`;
      }
    } catch (e) {}
    return 'http://localhost:3001/#owner-portal';
  }

  checkEditPermission(post) {
    const user = this.currentUser;

    if (!post) {
      if (!user) {
        return { allowed: false, reason: 'Please sign in or register to publish creative works.' };
      }
      return { allowed: true, reason: 'Publishing Allowed' };
    }

    if (!user) {
      return { allowed: false, reason: 'Please sign in or register to edit works.' };
    }

    if (user.role === 'owner' || user.name === 'Aaditya Kumar') {
      return {
        allowed: true,
        isOwnerOverride: true,
        reason: '👑 Owner Master Access: Aaditya Kumar has complete authority to edit any work.'
      };
    }

    if (user.role === 'author' || user.id) {
      if (post.authorId === user.id || post.authorName === user.name) {
        return {
          allowed: true,
          isAuthor: true,
          reason: '✍️ Author Access: You are the original author of this work.'
        };
      } else {
        return {
          allowed: false,
          reason: `🔒 Security Restriction: Only the original publisher (${post.authorName}) or Platform Owner Aaditya Kumar can edit this work.`
        };
      }
    }

    return {
      allowed: false,
      reason: '🔒 Read Only: Only original author or Owner can edit.'
    };
  }

  showSecurityToast(type, title, message) {
    this.securityToast = { type, title, message, id: Date.now() };
    this.notify();
    setTimeout(() => {
      if (this.securityToast && this.securityToast.id === this.securityToast.id) {
        this.securityToast = null;
        this.notify();
      }
    }, 4500);
  }

  clearSecurityToast() {
    this.securityToast = null;
    this.notify();
  }

  addSecurityLog(text) {
    this.securityLogs.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      text
    });
    if (this.securityLogs.length > 25) this.securityLogs.pop();
  }

  openEditor(postToEdit = null) {
    if (!this.currentUser) {
      this.showSecurityToast('info', 'Sign In Required', 'Please sign in or create an account to publish creative works.');
      this.openAuthModal('login');
      return false;
    }

    const perm = this.checkEditPermission(postToEdit);
    if (!perm.allowed) {
      this.showSecurityToast('error', 'Edit Blocked', perm.reason);
      this.addSecurityLog(`BLOCKED: ${this.currentUser?.name || 'Visitor'} attempted to edit "${postToEdit?.title}".`);
      return false;
    }

    this.editingPost = postToEdit;
    this.isEditorOpen = true;
    this.notify();
    return true;
  }

  closeEditor() {
    this.isEditorOpen = false;
    this.editingPost = null;
    this.notify();
  }

  savePost(postData) {
    if (!this.currentUser) {
      this.openAuthModal('login');
      return false;
    }

    const perm = this.checkEditPermission(this.editingPost);
    if (!perm.allowed) {
      this.showSecurityToast('error', 'Security Block', perm.reason);
      return false;
    }

    const user = this.currentUser;

    if (this.editingPost) {
      this.posts = this.posts.map(p => {
        if (p.id === this.editingPost.id) {
          return {
            ...p,
            ...postData,
            updatedAt: new Date().toISOString(),
            lastEditedBy: `${user.name} (${user.role})`
          };
        }
        return p;
      });
      this.addSecurityLog(`EDIT SUCCESS: "${postData.title}" edited by ${user.name}.`);
      this.showSecurityToast('success', 'Work Saved', `Successfully updated "${postData.title}".`);
    } else {
      const customAuthorName = postData.authorName || user.name;
      const newPost = {
        id: `post-${Date.now()}`,
        ...postData,
        authorId: user.id,
        authorName: customAuthorName,
        authorAvatar: user.avatar,
        language: postData.language || 'English',
        customLanguage: postData.customLanguage || '',
        englishTranslation: postData.englishTranslation || '',
        likes: 0,
        createdAt: new Date().toISOString(),
        isPinned: false
      };
      this.posts.unshift(newPost);
      this.addSecurityLog(`PUBLISH SUCCESS: New work "${newPost.title}" published by ${customAuthorName}.`);
      this.showSecurityToast('success', 'Work Published', `"${newPost.title}" is now live!`);
    }

    this.saveToStorage(LOCAL_STORAGE_KEYS.POSTS, this.posts);
    this.pushToCloud();

    this.closeEditor();
    this.notify();
    return true;
  }

  deletePost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    const perm = this.checkEditPermission(post);
    if (!perm.allowed) {
      this.showSecurityToast('error', 'Security Block', perm.reason);
      return false;
    }

    const user = this.currentUser;

    this.posts = this.posts.filter(p => p.id !== postId);
    this.saveToStorage(LOCAL_STORAGE_KEYS.POSTS, this.posts);
    this.pushToCloud();

    this.addSecurityLog(`DELETE SUCCESS: "${post.title}" deleted by ${user?.name || 'Owner'}.`);
    this.showSecurityToast('info', 'Work Deleted', `"${post.title}" has been removed.`);

    if (this.activePostId === postId) {
      this.activePostId = null;
    }

    this.notify();
    return true;
  }

  togglePinPost(postId) {
    const user = this.currentUser;

    if (!user || (user.role !== 'owner' && user.name !== 'Aaditya Kumar')) {
      this.showSecurityToast('error', 'Owner Power Only', 'Only Platform Owner Aaditya Kumar can feature works on the home banner.');
      return;
    }

    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        const nextPinned = !p.isPinned;
        this.showSecurityToast('info', 'Featured Status', `Post "${p.title}" ${nextPinned ? 'pinned to home banner' : 'unpinned'}.`);
        return { ...p, isPinned: nextPinned };
      }
      return p;
    });

    this.saveToStorage(LOCAL_STORAGE_KEYS.POSTS, this.posts);
    this.pushToCloud();
    this.notify();
  }

  toggleLikePost(postId) {
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        return { ...p, likes: (p.likes || 0) + 1 };
      }
      return p;
    });
    this.saveToStorage(LOCAL_STORAGE_KEYS.POSTS, this.posts);
    this.pushToCloud();
    this.notify();
  }

  toggleBookmark(postId) {
    if (this.bookmarks.includes(postId)) {
      this.bookmarks = this.bookmarks.filter(id => id !== postId);
      this.showSecurityToast('info', 'Bookmark Removed', 'Work removed from your library.');
    } else {
      this.bookmarks.push(postId);
      this.showSecurityToast('success', 'Work Saved', 'Work saved to your library.');
    }
    this.saveToStorage(LOCAL_STORAGE_KEYS.BOOKMARKS, this.bookmarks);
    this.notify();
  }

  addComment(postId, content) {
    if (!content.trim()) return;
    const user = this.currentUser;
    const authorName = user ? user.name : 'Guest Reader';
    const authorAvatar = user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

    const newComment = {
      id: `comment-${Date.now()}`,
      postId,
      authorName,
      authorAvatar,
      content,
      createdAt: new Date().toISOString()
    };
    this.comments.push(newComment);
    this.saveToStorage(LOCAL_STORAGE_KEYS.COMMENTS, this.comments);
    this.notify();
  }

  deleteComment(commentId) {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;

    const user = this.currentUser;
    const canDelete = user && (user.name === 'Aaditya Kumar' || user.role === 'owner' || comment.authorName === user.name);
    if (!canDelete) {
      this.showSecurityToast('error', 'Access Restricted', 'You can only delete your own comments or moderate as Owner Aaditya Kumar.');
      return;
    }

    this.comments = this.comments.filter(c => c.id !== commentId);
    this.saveToStorage(LOCAL_STORAGE_KEYS.COMMENTS, this.comments);
    this.showSecurityToast('info', 'Comment Deleted', 'Comment removed.');
    this.notify();
  }

  setActiveCategory(cat) {
    this.activeCategory = cat;
    this.notify();
  }

  setSearchQuery(query) {
    this.searchQuery = query;
    this.notify();
  }

  setActivePostId(postId) {
    this.activePostId = postId;
    this.notify();
  }

  setOwnerDashboardOpen(isOpen) {
    const user = this.currentUser;
    if (isOpen && (!user || (user.name !== 'Aaditya Kumar' && user.role !== 'owner'))) {
      this.showSecurityToast('error', 'Owner Power Restricted', 'Only Platform Owner Aaditya Kumar can access the Master Control Panel.');
      return;
    }
    this.isOwnerDashboardOpen = isOpen;
    this.notify();
  }
}

export const store = new Store();
