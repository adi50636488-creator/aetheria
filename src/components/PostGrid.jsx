import React from 'react';
import { PostCard } from './PostCard';
import { Feather, PlusCircle, Sparkles } from 'lucide-react';

export const PostGrid = ({
  posts,
  currentUser,
  onCheckPermission,
  onReadPost,
  onEditPost,
  onToggleLike,
  onToggleBookmark,
  bookmarks,
  onOpenEditor
}) => {
  if (posts.length === 0) {
    return (
      <div className="glass-panel glow-effect" style={{
        textAlign: 'center',
        padding: '70px 28px',
        margin: '40px 0',
        background: 'linear-gradient(135deg, rgba(22, 25, 46, 0.95) 0%, rgba(30, 20, 40, 0.95) 100%)',
        border: '1px border-highlight'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--accent-glow)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
          marginBottom: '20px'
        }}>
          <Feather size={32} />
        </div>

        <h3 className="font-heading" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)' }}>
          Welcome to Aetheria Creative Sanctuary
        </h3>

        <p className="font-serif" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px auto', fontStyle: 'italic' }}>
          The platform is blank and ready for creators. Be the very first publisher to share a poem, story, shayari, philosophical theory, or visual artwork!
        </p>

        <button
          onClick={() => onOpenEditor(null)}
          className="btn btn-primary"
          style={{ padding: '14px 28px', fontSize: '1rem' }}
        >
          <PlusCircle size={20} /> Publish Your First Work Now
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
      gap: '24px',
      margin: '24px 0'
    }}>
      {posts.map(post => {
        const permission = onCheckPermission(post);
        const isBookmarked = bookmarks.includes(post.id);
        return (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            permission={permission}
            onRead={onReadPost}
            onEdit={onEditPost}
            onToggleLike={onToggleLike}
            onToggleBookmark={onToggleBookmark}
            isBookmarked={isBookmarked}
          />
        );
      })}
    </div>
  );
};
