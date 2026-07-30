import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { Navbar } from './components/Navbar';
import { RoleSwitcher } from './components/RoleSwitcher';
import { HeroBanner } from './components/HeroBanner';
import { PostGrid } from './components/PostGrid';
import { PostDetailModal } from './components/PostDetailModal';
import { EditorModal } from './components/EditorModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { AuthModal } from './components/AuthModal';
import { SecurityToast } from './components/SecurityToast';
import { Feather, Heart, Shield, Crown, Sparkles, Trees, Mountain, BookOpen } from 'lucide-react';

export function App() {
  const [state, setState] = useState({
    posts: store.posts,
    currentUser: store.currentUser,
    isOwnerAuthenticated: store.isOwnerAuthenticated,
    theme: store.theme,
    soundscape: store.soundscape,
    bookmarks: store.bookmarks,
    comments: store.comments,
    activeCategory: store.activeCategory,
    searchQuery: store.searchQuery,
    activePostId: store.activePostId,
    isEditorOpen: store.isEditorOpen,
    editingPost: store.editingPost,
    isOwnerDashboardOpen: store.isOwnerDashboardOpen,
    isAuthModalOpen: store.isAuthModalOpen,
    authModalInitialTab: store.authModalInitialTab,
    securityToast: store.securityToast,
    securityLogs: store.securityLogs
  });

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState({
        posts: [...store.posts],
        currentUser: { ...store.currentUser },
        isOwnerAuthenticated: store.isOwnerAuthenticated,
        theme: store.theme,
        soundscape: store.soundscape,
        bookmarks: [...store.bookmarks],
        comments: [...store.comments],
        activeCategory: store.activeCategory,
        searchQuery: store.searchQuery,
        activePostId: store.activePostId,
        isEditorOpen: store.isEditorOpen,
        editingPost: store.editingPost,
        isOwnerDashboardOpen: store.isOwnerDashboardOpen,
        isAuthModalOpen: store.isAuthModalOpen,
        authModalInitialTab: store.authModalInitialTab,
        securityToast: store.securityToast,
        securityLogs: [...store.securityLogs]
      });
    });
    return unsubscribe;
  }, []);

  // Filter posts
  const filteredPosts = state.posts.filter(p => {
    const matchesCategory = state.activeCategory === 'all' || p.category === state.activeCategory;
    const q = state.searchQuery.toLowerCase();
    const matchesSearch = !q || (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
    return matchesCategory && matchesSearch;
  });

  const featuredPost = state.posts.find(p => p.isPinned) || state.posts[0];
  const activePost = state.posts.find(p => p.id === state.activePostId);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Light Nature Scenery Background Backdrop */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        opacity: 0.12,
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'saturate(0.8) contrast(0.95)'
      }} />

      {/* Top Security & Role Control Bar */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <RoleSwitcher
          currentUser={state.currentUser}
          isOwnerAuthenticated={state.isOwnerAuthenticated}
          onOpenAuthModal={(tab) => store.openAuthModal(tab)}
          onLogoutUser={() => store.logoutUser()}
          onOpenOwnerDashboard={() => store.setOwnerDashboardOpen(true)}
        />
      </div>

      {/* Main Glass Navbar */}
      <div style={{ position: 'relative', zIndex: 9 }}>
        <Navbar
          activeCategory={state.activeCategory}
          onSelectCategory={(cat) => store.setActiveCategory(cat)}
          searchQuery={state.searchQuery}
          onSearchChange={(q) => store.setSearchQuery(q)}
          theme={state.theme}
          onSelectTheme={(t) => store.setTheme(t)}
          soundscape={state.soundscape}
          onSelectSoundscape={(s) => store.setSoundscape(s)}
          currentUser={state.currentUser}
          onOpenEditor={(post) => store.openEditor(post)}
          onOpenOwnerDashboard={() => store.setOwnerDashboardOpen(true)}
          bookmarkCount={state.bookmarks.length}
        />
      </div>

      {/* Main Layout Body */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '0 24px 40px 24px', position: 'relative', zIndex: 5 }}>
        
        {/* Featured Banner (if posts exist) */}
        {state.activeCategory === 'all' && !state.searchQuery && featuredPost && (
          <HeroBanner
            featuredPost={featuredPost}
            onReadPost={(postId) => store.setActivePostId(postId)}
            onOpenEditor={(post) => store.openEditor(post)}
            currentUser={state.currentUser}
          />
        )}

        {/* Section Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', marginBottom: '8px' }}>
          <div>
            <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trees size={22} style={{ color: 'var(--accent-primary)' }} />
              {state.activeCategory === 'all' ? 'Published Works' : `${state.activeCategory.replace('_', ' ').toUpperCase()} Collection`}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
              Showing {filteredPosts.length} creative pieces • Platform Owner: Aaditya Kumar
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        <PostGrid
          posts={filteredPosts}
          currentUser={state.currentUser}
          onCheckPermission={(post) => store.checkEditPermission(post)}
          onReadPost={(postId) => store.setActivePostId(postId)}
          onEditPost={(post) => store.openEditor(post)}
          onToggleLike={(postId) => store.toggleLikePost(postId)}
          onToggleBookmark={(postId) => store.toggleBookmark(postId)}
          bookmarks={state.bookmarks}
          onOpenEditor={(post) => store.openEditor(post)}
        />
      </main>

      {/* Reader Detail Modal */}
      {activePost && (
        <PostDetailModal
          post={activePost}
          currentUser={state.currentUser}
          permission={store.checkEditPermission(activePost)}
          comments={state.comments}
          onClose={() => store.setActivePostId(null)}
          onEdit={(post) => {
            store.setActivePostId(null);
            store.openEditor(post);
          }}
          onToggleLike={(postId) => store.toggleLikePost(postId)}
          onToggleBookmark={(postId) => store.toggleBookmark(postId)}
          isBookmarked={state.bookmarks.includes(activePost.id)}
          onAddComment={(postId, text) => store.addComment(postId, text)}
          onDeleteComment={(commentId) => store.deleteComment(commentId)}
          onTogglePin={(postId) => store.togglePinPost(postId)}
        />
      )}

      {/* Publisher & Owner Editor Modal */}
      {state.isEditorOpen && (
        <EditorModal
          post={state.editingPost}
          currentUser={state.currentUser}
          permission={store.checkEditPermission(state.editingPost)}
          onClose={() => store.closeEditor()}
          onSave={(postData) => store.savePost(postData)}
        />
      )}

      {/* Platform Owner Master Panel Modal */}
      {state.isOwnerDashboardOpen && (
        <OwnerDashboardModal
          posts={state.posts}
          currentUser={state.currentUser}
          securityLogs={state.securityLogs}
          onClose={() => store.setOwnerDashboardOpen(false)}
          onEditPost={(post) => store.openEditor(post)}
          onDeletePost={(postId) => store.deletePost(postId)}
          onTogglePin={(postId) => store.togglePinPost(postId)}
        />
      )}

      {/* Multi-Portal Auth Modal (User Sign In, Sign Up & Owner Portal) */}
      {state.isAuthModalOpen && (
        <AuthModal
          initialTab={state.authModalInitialTab}
          onClose={() => store.closeAuthModal()}
          onLoginUser={(credentials) => store.loginUser(credentials)}
          onRegisterUser={(userData) => store.registerUser(userData)}
          onLoginOwner={(credentials) => store.loginOwner(credentials)}
        />
      )}

      {/* Real-time Security Notification Toast */}
      <SecurityToast
        toast={state.securityToast}
        onClose={() => store.clearSecurityToast()}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-glass)',
        padding: '32px 24px',
        textAlign: 'center',
        marginTop: 'auto',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} style={{ color: 'var(--accent-primary)' }} />
            <span className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 800 }}>AETHERIA</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '600px', fontFamily: 'var(--font-sans)' }}>
            Creative publishing sanctuary owned by <strong>Aaditya Kumar</strong>. Dedicated to poets, storytellers, essayists, and digital artists.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '8px', fontFamily: 'var(--font-sans)' }}>
            © 2026 Aetheria Publishing Sanctuary • Platform Owner: Aaditya Kumar
          </div>
        </div>
      </footer>

    </div>
  );
}
