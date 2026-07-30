import React, { useState } from 'react';
import { Feather, Heart, Bookmark, Edit3, Trash2, Pin, Sparkles, BookOpen, Volume2, Moon, Smile, Layers, Languages, Globe } from 'lucide-react';

export const CATEGORY_LABELS = {
  small_story: { label: 'Small Story', icon: Sparkles, color: '#3b82f6' },
  story: { label: 'Story', icon: BookOpen, color: '#8b5cf6' },
  poem: { label: 'Poem', icon: Feather, color: '#ec4899' },
  thought: { label: 'Thought', icon: Sparkles, color: '#10b981' },
  theory: { label: 'Theory', icon: Sparkles, color: '#f59e0b' },
  song: { label: 'Song', icon: Volume2, color: '#06b6d4' },
  three_am_thought: { label: '3AM Thought', icon: Moon, color: '#a855f7' },
  paradox: { label: 'Paradox', icon: Sparkles, color: '#6366f1' },
  joke: { label: 'Joke', icon: Smile, color: '#eab308' },
  others: { label: 'Others', icon: Layers, color: '#64748b' }
};

export const PostCard = ({
  post,
  currentUser,
  permission,
  onRead,
  onEdit,
  onToggleLike,
  onToggleBookmark,
  isBookmarked
}) => {
  const [showTranslation, setShowTranslation] = useState(false);

  const catConfig = CATEGORY_LABELS[post.category] || CATEGORY_LABELS.others;
  const CategoryIcon = catConfig.icon;
  const displayCategoryLabel = post.category === 'others' && post.customCategory ? post.customCategory : catConfig.label;

  const displayLanguage = post.language === 'Other' && post.customLanguage ? post.customLanguage : (post.language || 'English');
  const isNonEnglish = displayLanguage.toLowerCase().includes('hindi') || displayLanguage.toLowerCase().includes('hinglish') || displayLanguage !== 'English';

  // Simple auto-translator preview for Hindi / Hinglish / non-English works
  const getAutoTranslation = () => {
    if (post.englishTranslation) return post.englishTranslation;
    return `[Simple English Translation]: ${post.excerpt || post.content}`;
  };

  return (
    <article className="post-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Top Meta Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* Category Pill */}
          <span style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: `${catConfig.color}20`,
            color: catConfig.color,
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontFamily: 'var(--font-sans)'
          }}>
            <CategoryIcon size={12} />
            <span>{displayCategoryLabel}</span>
          </span>

          {/* Language Tag */}
          <span style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--font-sans)'
          }}>
            <Globe size={11} />
            <span>{displayLanguage}</span>
          </span>

        </div>

        {/* Pinned Badge */}
        {post.isPinned && (
          <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-sans)' }}>
            <Pin size={12} /> Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className="font-heading"
        onClick={() => onRead(post.id)}
        style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          marginBottom: '10px',
          cursor: 'pointer',
          lineHeight: '1.35'
        }}
      >
        {post.title}
      </h3>

      {/* Content Preview / Translation toggle */}
      <div style={{ flex: 1, marginBottom: '16px' }}>
        <p style={{
          fontFamily: showTranslation ? 'var(--font-sans)' : 'var(--font-serif)',
          fontSize: '0.98rem',
          color: 'var(--text-main)',
          lineHeight: '1.65',
          opacity: 0.95
        }}>
          {showTranslation ? getAutoTranslation() : (post.excerpt || post.content)}
        </p>

        {/* Translation Toggle Button */}
        {isNonEnglish && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowTranslation(!showTranslation); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '6px',
              padding: 0,
              fontFamily: 'var(--font-sans)'
            }}
          >
            <Languages size={13} />
            <span>{showTranslation ? 'Show Original' : 'Translate to English'}</span>
          </button>
        )}
      </div>

      {/* Author & Footer Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-color)',
        marginTop: 'auto'
      }}>
        {/* Author Avatar & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
            alt={post.authorName}
            style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-subtle)', fontFamily: 'var(--font-sans)' }}>
            {post.authorName}
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          
          {/* Read Button */}
          <button
            onClick={() => onRead(post.id)}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Read
          </button>

          {/* Edit Button (if permitted) */}
          {permission?.allowed && (
            <button
              onClick={() => onEdit(post)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '4px' }}
              title="Edit Work"
            >
              <Edit3 size={15} />
            </button>
          )}

          {/* Like Button */}
          <button
            onClick={() => onToggleLike(post.id)}
            style={{ background: 'none', border: 'none', color: post.likes > 0 ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem' }}
          >
            <Heart size={15} fill={post.likes > 0 ? '#ef4444' : 'none'} />
            <span>{post.likes || 0}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(post.id)}
            style={{ background: 'none', border: 'none', color: isBookmarked ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <Bookmark size={15} fill={isBookmarked ? 'var(--accent-primary)' : 'none'} />
          </button>

        </div>
      </div>

    </article>
  );
};
