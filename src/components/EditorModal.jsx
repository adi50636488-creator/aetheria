import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert, Sparkles, Feather, BookOpen, Volume2, Moon, Smile, Layers, Globe, Languages } from 'lucide-react';

const DRAFT_KEYS = {
  TITLE: 'aetheria_draft_title',
  CONTENT: 'aetheria_draft_content',
  CATEGORY: 'aetheria_draft_category',
  LANGUAGE: 'aetheria_draft_language',
  TRANSLATION: 'aetheria_draft_translation',
  TAGS: 'aetheria_draft_tags'
};

export const EditorModal = ({ post, currentUser, permission, onClose, onSave }) => {
  // Load draft from storage for new posts to prevent any character loss on mobile!
  const [title, setTitle] = useState(() => {
    if (post) return post.title || '';
    try { return localStorage.getItem(DRAFT_KEYS.TITLE) || ''; } catch (e) { return ''; }
  });

  const [category, setCategory] = useState(() => {
    if (post) return post.category || 'small_story';
    try { return localStorage.getItem(DRAFT_KEYS.CATEGORY) || 'small_story'; } catch (e) { return 'small_story'; }
  });

  const [customCategory, setCustomCategory] = useState(() => post ? (post.customCategory || '') : '');
  
  const [language, setLanguage] = useState(() => {
    if (post) return post.language || 'English';
    try { return localStorage.getItem(DRAFT_KEYS.LANGUAGE) || 'English'; } catch (e) { return 'English'; }
  });

  const [customLanguage, setCustomLanguage] = useState(() => post ? (post.customLanguage || '') : '');
  
  const [content, setContent] = useState(() => {
    if (post) return post.content || '';
    try { return localStorage.getItem(DRAFT_KEYS.CONTENT) || ''; } catch (e) { return ''; }
  });

  const [englishTranslation, setEnglishTranslation] = useState(() => {
    if (post) return post.englishTranslation || '';
    try { return localStorage.getItem(DRAFT_KEYS.TRANSLATION) || ''; } catch (e) { return ''; }
  });

  const [excerpt, setExcerpt] = useState(() => post ? (post.excerpt || '') : '');
  
  const [tags, setTags] = useState(() => {
    if (post && post.tags) return post.tags.join(', ');
    try { return localStorage.getItem(DRAFT_KEYS.TAGS) || ''; } catch (e) { return ''; }
  });

  const [authorName, setAuthorName] = useState(() => post ? (post.authorName || '') : (currentUser?.name || ''));

  // Save typing draft continuously to prevent loss on mobile app switching / refreshes
  useEffect(() => {
    if (!post) {
      try {
        localStorage.setItem(DRAFT_KEYS.TITLE, title);
        localStorage.setItem(DRAFT_KEYS.CONTENT, content);
        localStorage.setItem(DRAFT_KEYS.CATEGORY, category);
        localStorage.setItem(DRAFT_KEYS.LANGUAGE, language);
        localStorage.setItem(DRAFT_KEYS.TRANSLATION, englishTranslation);
        localStorage.setItem(DRAFT_KEYS.TAGS, tags);
      } catch (e) {}
    }
  }, [title, content, category, language, englishTranslation, tags, post]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEYS.TITLE);
      localStorage.removeItem(DRAFT_KEYS.CONTENT);
      localStorage.removeItem(DRAFT_KEYS.CATEGORY);
      localStorage.removeItem(DRAFT_KEYS.LANGUAGE);
      localStorage.removeItem(DRAFT_KEYS.TRANSLATION);
      localStorage.removeItem(DRAFT_KEYS.TAGS);
    } catch (e) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please provide a title and content for your creative work.');
      return;
    }

    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const generatedExcerpt = excerpt.trim() || (content.length > 150 ? content.slice(0, 150) + '...' : content);

    const success = onSave({
      title: title.trim(),
      category,
      customCategory: category === 'others' ? customCategory.trim() : '',
      language,
      customLanguage: language === 'Other' ? customLanguage.trim() : '',
      content: content.trim(),
      englishTranslation: englishTranslation.trim(),
      excerpt: generatedExcerpt,
      tags: tagArray,
      authorName: authorName.trim() || currentUser?.name || 'Anonymous Author'
    });

    if (success !== false) {
      clearDraft();
    }
  };

  // Prevent mobile keyboard Enter from submitting form prematurely
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const isOwnerOverride = permission?.isOwnerOverride;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h3 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              {post ? 'Edit Creative Work' : 'Publish New Creative Work'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-sans)' }}>
              {isOwnerOverride
                ? '👑 Owner Authority: Aaditya Kumar master editing mode.'
                : `Publishing as: ${authorName || currentUser?.name || 'Publisher'}`}
            </span>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Security Alert Badge */}
        {isOwnerOverride && (
          <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.82rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)' }}>
            <ShieldAlert size={16} />
            <span>Platform Owner Master Edit Power: Modifications will update globally.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Title Input */}
          <div className="form-group">
            <label className="form-label">Title of Your Work *</label>
            <input
              type="text"
              placeholder="e.g. Whispers in the Rain, The Midnight Paradox, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="form-input"
              required
            />
          </div>

          {/* Grid: Category & Language */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* Category Dropdown */}
            <div className="form-group">
              <label className="form-label">Category / Type of Work *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input">
                <option value="small_story">✨ Small Story</option>
                <option value="story">📖 Story (Long Story)</option>
                <option value="poem">🪶 Poem</option>
                <option value="thought">💡 Thought</option>
                <option value="theory">🧠 Theory</option>
                <option value="song">🎵 Song</option>
                <option value="three_am_thought">🌙 3AM Thought</option>
                <option value="paradox">🌀 Paradox</option>
                <option value="joke">😄 Joke</option>
                <option value="others">📑 Others (Custom Category)</option>
              </select>
            </div>

            {/* Language Selector */}
            <div className="form-group">
              <label className="form-label">Language of Work *</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="form-input">
                <option value="English">🌐 English</option>
                <option value="Hindi / हिंदी">🇮🇳 Hindi / हिंदी</option>
                <option value="Hinglish">🗣️ Hinglish</option>
                <option value="Spanish">🇪🇸 Spanish</option>
                <option value="French">🇫🇷 French</option>
                <option value="German">🇩🇪 German</option>
                <option value="Other">🌐 Other Language</option>
              </select>
            </div>

          </div>

          {/* Conditional Custom Category Input */}
          {category === 'others' && (
            <div className="form-group" style={{ background: 'var(--bg-hover)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-highlight)' }}>
              <label className="form-label">Specify Custom Category *</label>
              <input
                type="text"
                placeholder="e.g. Micro-fiction, Haiku, Philosophical Essay, etc."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="form-input"
                required
              />
            </div>
          )}

          {/* Conditional Custom Language Input */}
          {language === 'Other' && (
            <div className="form-group" style={{ background: 'var(--bg-hover)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-highlight)' }}>
              <label className="form-label">Specify Language Name *</label>
              <input
                type="text"
                placeholder="e.g. Sanskrit, Bengali, Marathi, Japanese, etc."
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="form-input"
                required
              />
            </div>
          )}

          {/* Main Content Body */}
          <div className="form-group">
            <label className="form-label">Work Content * (Supports Hindi, English & any script)</label>
            <textarea
              rows={8}
              placeholder="Write or paste your poem, story, shayari, theory, joke, or 3AM thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-input"
              style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', lineHeight: '1.7' }}
              required
            />
          </div>

          {/* English Translation Field */}
          <div className="form-group" style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px' }}>
              <Languages size={16} /> Optional English Translation (For readers who want to read in English)
            </div>
            <textarea
              rows={4}
              placeholder="Provide a simple English translation of your work (optional)..."
              value={englishTranslation}
              onChange={(e) => setEnglishTranslation(e.target.value)}
              className="form-input"
              style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. romance, philosophy, late-night, funny, motivation"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="form-input"
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>

            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              <Save size={16} />
              <span>{post ? 'Save Changes' : 'Publish Work'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
