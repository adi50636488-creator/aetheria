import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert, Sparkles, Feather, BookOpen, Volume2, Moon, Smile, Layers, Globe, Languages } from 'lucide-react';
import { CATEGORIES_LIST, LANGUAGES_LIST } from '../services/store';

export const EditorModal = ({ post, currentUser, permission, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('small_story');
  const [customCategory, setCustomCategory] = useState('');
  const [language, setLanguage] = useState('English');
  const [customLanguage, setCustomLanguage] = useState('');
  const [content, setContent] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setCategory(post.category || 'small_story');
      setCustomCategory(post.customCategory || '');
      setLanguage(post.language || 'English');
      setCustomLanguage(post.customLanguage || '');
      setContent(post.content || '');
      setEnglishTranslation(post.englishTranslation || '');
      setExcerpt(post.excerpt || '');
      setTags(post.tags ? post.tags.join(', ') : '');
      setAuthorName(post.authorName || currentUser?.name || '');
    } else {
      setTitle('');
      setCategory('small_story');
      setCustomCategory('');
      setLanguage('English');
      setCustomLanguage('');
      setContent('');
      setEnglishTranslation('');
      setExcerpt('');
      setTags('');
      setAuthorName(currentUser?.name || 'Anonymous Author');
    }
  }, [post, currentUser]);

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

    onSave({
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
                : `Publishing as: ${authorName || currentUser?.name}`}
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
          
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title of Your Work *</label>
            <input
              type="text"
              placeholder="e.g. Whispers in the Rain, The Midnight Paradox, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          {/* English Translation Field (For Hindi or other language works) */}
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
            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px', display: 'block', fontFamily: 'var(--font-sans)' }}>
              If left blank, readers can click "Translate to English" to view an instant auto-generated English translation!
            </span>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. romance, philosophy, late-night, funny, motivation"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
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
