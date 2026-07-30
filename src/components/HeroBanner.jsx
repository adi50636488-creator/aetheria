import React from 'react';
import { Sparkles, Feather, ShieldCheck, Crown, Heart, Clock, ArrowRight } from 'lucide-react';

export const HeroBanner = ({ featuredPost, onReadPost, onOpenEditor, currentUser }) => {
  if (!featuredPost) return null;

  return (
    <section className="glass-panel glow-effect" style={{
      margin: '28px 0',
      padding: '36px',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(22, 25, 46, 0.9) 0%, rgba(35, 20, 48, 0.8) 100%)'
    }}>
      {/* Subtle Background Art Backdrop */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        backgroundImage: `url(${featuredPost.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.25,
        maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
        
        {/* Featured Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="badge badge-owner" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Crown size={12} /> Pinned Feature
          </span>
          <span className="badge badge-category">{featuredPost.category.replace('_', ' ')}</span>
        </div>

        {/* Title */}
        <h2 className="font-heading" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '14px', lineHeight: 1.2 }}>
          {featuredPost.title}
        </h2>

        {/* Excerpt */}
        <p className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '24px', fontStyle: 'italic' }}>
          "{featuredPost.excerpt}"
        </p>

        {/* Author & Meta Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={featuredPost.authorAvatar}
              alt={featuredPost.authorName}
              style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }}
            />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{featuredPost.authorName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Original Author</div>
            </div>
          </div>

          <div style={{ height: '24px', width: '1px', background: 'var(--border-color)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> {featuredPost.readTimeMinutes} min read
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Heart size={14} style={{ color: '#ec4899' }} /> {featuredPost.likes} likes
            </span>
          </div>
        </div>

        {/* Call to Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => onReadPost(featuredPost.id)}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            Read Interactive Work <ArrowRight size={18} />
          </button>
          
          <button
            onClick={() => onOpenEditor(null)}
            className="btn btn-secondary"
            style={{ padding: '12px 20px', fontSize: '0.95rem' }}
          >
            <Feather size={16} /> Publish Your Own Work
          </button>
        </div>

      </div>
    </section>
  );
};
