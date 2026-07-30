import React, { useState } from 'react';
import { X, Heart, Bookmark, Edit3, Trash2, Pin, MessageSquare, Send, Languages, Globe, Feather, BookOpen, Volume2, Moon, Smile, Layers, Sparkles } from 'lucide-react';
import { CATEGORY_LABELS } from './PostCard';

export const PostDetailModal = ({
  post,
  currentUser,
  permission,
  comments,
  onClose,
  onEdit,
  onToggleLike,
  onToggleBookmark,
  isBookmarked,
  onAddComment,
  onDeleteComment,
  onTogglePin
}) => {
  const [newComment, setNewComment] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);

  const catConfig = CATEGORY_LABELS[post.category] || CATEGORY_LABELS.others;
  const CategoryIcon = catConfig.icon;
  const displayCategoryLabel = post.category === 'others' && post.customCategory ? post.customCategory : catConfig.label;

  const displayLanguage = post.language === 'Other' && post.customLanguage ? post.customLanguage : (post.language || 'English');
  const isNonEnglish = displayLanguage.toLowerCase().includes('hindi') || displayLanguage.toLowerCase().includes('hinglish') || displayLanguage !== 'English';

  const postComments = comments.filter(c => c.postId === post.id);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(post.id, newComment.trim());
    setNewComment('');
  };

  const isOwner = currentUser && (currentUser.name === 'Aaditya Kumar' || currentUser.role === 'owner');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* Category Tag */}
            <span style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: `${catConfig.color}20`,
              color: catConfig.color,
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-sans)'
            }}>
              <CategoryIcon size={14} />
              <span>{displayCategoryLabel}</span>
            </span>

            {/* Language Tag */}
            <span style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontFamily: 'var(--font-sans)'
            }}>
              <Globe size={13} />
              <span>{displayLanguage}</span>
            </span>

            {/* Translation Button */}
            {isNonEnglish && (
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                style={{
                  background: showTranslation ? 'var(--accent-glow)' : 'var(--bg-input)',
                  border: '1px solid var(--accent-primary)',
                  color: 'var(--accent-primary)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                <Languages size={14} />
                <span>{showTranslation ? 'Show Original Language' : 'Translate to English'}</span>
              </button>
            )}

          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Title */}
        <h2 className="font-heading" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', lineHeight: '1.3' }}>
          {post.title}
        </h2>

        {/* Author Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
              alt={post.authorName}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', fontFamily: 'var(--font-sans)' }}>
                {post.authorName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-sans)' }}>
                Published on {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isOwner && (
              <button
                onClick={() => onTogglePin(post.id)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem', color: post.isPinned ? '#f59e0b' : 'var(--text-muted)' }}
              >
                <Pin size={14} /> {post.isPinned ? 'Unpin' : 'Pin to Banner'}
              </button>
            )}

            {permission?.allowed && (
              <button onClick={() => onEdit(post)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                <Edit3 size={14} /> Edit Work
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ marginBottom: '32px' }}>
          
          {showTranslation && (
            <div style={{ background: 'var(--bg-hover)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-highlight)', marginBottom: '20px', fontSize: '0.82rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-sans)' }}>
              🌐 Showing English Translation for <strong>{post.title}</strong>
            </div>
          )}

          <div style={{
            fontFamily: showTranslation ? 'var(--font-sans)' : 'var(--font-serif)',
            fontSize: '1.15rem',
            lineHeight: '1.85',
            color: 'var(--text-main)',
            whiteSpace: 'pre-line'
          }}>
            {showTranslation ? (post.englishTranslation || post.content) : post.content}
          </div>
        </div>

        {/* Footer Like & Bookmark Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '28px' }}>
          <button
            onClick={() => onToggleLike(post.id)}
            style={{ background: 'none', border: 'none', color: post.likes > 0 ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}
          >
            <Heart size={20} fill={post.likes > 0 ? '#ef4444' : 'none'} />
            <span>{post.likes || 0} Appreciation Likes</span>
          </button>

          <button
            onClick={() => onToggleBookmark(post.id)}
            style={{ background: 'none', border: 'none', color: isBookmarked ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}
          >
            <Bookmark size={20} fill={isBookmarked ? 'var(--accent-primary)' : 'none'} />
            <span>{isBookmarked ? 'Saved in Library' : 'Save to Library'}</span>
          </button>
        </div>

        {/* Comments Section */}
        <div>
          <h4 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} style={{ color: 'var(--accent-primary)' }} />
            <span>Community Thoughts ({postComments.length})</span>
          </h4>

          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Share a thoughtful comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 18px' }}>
              <Send size={16} />
            </button>
          </form>

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {postComments.map(c => (
              <div key={c.id} style={{ background: 'var(--bg-input)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>
                    {c.authorName}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-sans)' }}>
                    {c.content}
                  </p>
                </div>
                
                {(isOwner || c.authorName === currentUser?.name) && (
                  <button onClick={() => onDeleteComment(c.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
