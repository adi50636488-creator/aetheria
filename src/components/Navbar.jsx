import React, { useState } from 'react';
import {
  Feather, Search, Palette, Volume2, Bookmark, PlusCircle, Crown, ShieldAlert, Sun, Moon, Sparkles, BookOpen, User, LogOut, Menu, X, LogIn, UserPlus, Smile, Layers
} from 'lucide-react';
import { store, CATEGORIES_LIST } from '../services/store';

const THEME_PRESETS = [
  { id: 'classic-parchment', name: 'Classic Parchment', font: 'EB Garamond' },
  { id: 'warm-cream', name: 'Warm Cream Paper', font: 'Merriweather' },
  { id: 'soft-sage', name: 'Soft Sage Tea', font: 'Atkinson Hyperlegible' },
  { id: 'espresso-night', name: 'Espresso Night', font: 'Playfair Display' },
  { id: 'dusty-blue', name: 'Dusty Blue Linen', font: 'Plus Jakarta Sans' },
  { id: 'clean-light', name: 'Clean Light Theme', font: 'Inter' },
  { id: 'midnight-dark', name: 'Midnight Dark Theme', font: 'Inter' }
];

export const Navbar = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  theme,
  onSelectTheme,
  soundscape,
  onSelectSoundscape,
  currentUser,
  onOpenEditor,
  onOpenOwnerDashboard,
  bookmarkCount
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Feather': return Feather;
      case 'BookOpen': return BookOpen;
      case 'Sparkles': return Sparkles;
      case 'Volume2': return Volume2;
      case 'Moon': return Moon;
      case 'Smile': return Smile;
      case 'Layers': return Layers;
      default: return Sparkles;
    }
  };

  const soundOptions = [
    { id: 'off', label: 'Mute Audio', subtitle: 'Silent reading' },
    { id: 'rain', label: 'Gentle Rain', subtitle: 'Calming rain soundscape' },
    { id: 'fireplace', label: 'Cozy Fireplace', subtitle: 'Warm crackling fire' },
    { id: 'lofi', label: 'Lo-Fi Chill Beats', subtitle: 'Ambient background music' },
    { id: 'wind', label: 'Mountain Wind', subtitle: 'Soft rustling breeze' }
  ];

  const isOwner = currentUser && (currentUser.name === 'Aaditya Kumar' || currentUser.role === 'owner');

  return (
    <header style={{
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Logo & Brand Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => onSelectCategory('all')}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--border-highlight))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--bg-primary)',
              boxShadow: '0 4px 12px var(--accent-glow)'
            }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-main)', margin: 0 }}>
                AETHERIA
              </h1>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-sans)', display: 'block' }}>
                Creative Publishing Sanctuary • Owner: Aaditya Kumar
              </span>
            </div>
          </div>

          {/* Search Input Bar */}
          <div style={{ flex: 1, maxWidth: '420px', position: 'relative' }} className="hide-mobile">
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search poems, stories, 3AM thoughts, jokes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '40px', fontSize: '0.88rem' }}
            />
          </div>

          {/* Action Tools & Auth Options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* Reading Book Themes Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowThemeMenu(!showThemeMenu); setShowSoundMenu(false); }}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                title="Change Eye-Friendly Book Theme & Serif Font"
              >
                <Palette size={16} style={{ color: 'var(--accent-primary)' }} />
                <span className="hide-mobile">Book Themes</span>
              </button>

              {showThemeMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '280px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-highlight)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 110
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    📖 Eye-Friendly Reading Themes
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {THEME_PRESETS.map(t => (
                      <button
                        key={t.id}
                        onClick={() => { onSelectTheme(t.id); setShowThemeMenu(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: theme === t.id ? '1px solid var(--accent-primary)' : '1px solid transparent',
                          background: theme === t.id ? 'var(--bg-hover)' : 'transparent',
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: theme === t.id ? 700 : 500 }}>{t.name}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{t.font}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Web Ambient Soundscape Player */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowSoundMenu(!showSoundMenu); setShowThemeMenu(false); }}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                title="Ambient Reading Audio Soundscape"
              >
                <Volume2 size={16} style={{ color: soundscape !== 'off' ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                <span className="hide-mobile">{soundscape === 'off' ? 'Sound' : soundscape.toUpperCase()}</span>
              </button>

              {showSoundMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '260px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-highlight)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 110
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    🎵 Ambient Reading Soundscape
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {soundOptions.map(s => (
                      <button
                        key={s.id}
                        onClick={() => { onSelectSoundscape(s.id); setShowSoundMenu(false); }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: soundscape === s.id ? '1px solid var(--accent-primary)' : '1px solid transparent',
                          background: soundscape === s.id ? 'var(--bg-hover)' : 'transparent',
                          color: 'var(--text-main)',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: soundscape === s.id ? 700 : 500 }}>{s.label}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{s.subtitle}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Create New Publication Button */}
            <button
              onClick={() => onOpenEditor(null)}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700 }}
            >
              <PlusCircle size={16} />
              <span>Publish Work</span>
            </button>

            {/* CONDITIONAL AUTH BUTTONS IN NAVBAR */}
            {currentUser ? (
              /* If Logged In -> Show LOG OUT Button */
              <button
                onClick={() => store.logoutUser()}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Log Out of Account"
                className="hide-mobile"
              >
                <LogOut size={15} /> Log Out
              </button>
            ) : (
              /* If NOT Logged In -> Show SIGN IN and REGISTER Buttons */
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="hide-mobile">
                <button
                  onClick={() => store.openAuthModal('login')}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                >
                  <LogIn size={15} /> Sign In
                </button>
                <button
                  onClick={() => store.openAuthModal('signup')}
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  <UserPlus size={15} /> Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-secondary hide-desktop"
              style={{ padding: '8px' }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>

        </div>

        {/* Category Pill Bar Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '12px 0 4px 0', scrollbarWidth: 'none' }}>
          {CATEGORIES_LIST.map(cat => {
            const Icon = getCategoryIcon(cat.icon);
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: isActive ? 'var(--accent-glow)' : 'var(--bg-card)',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '12px' }} className="hide-desktop">
          <input
            type="text"
            placeholder="Search poems, stories, 3AM thoughts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input"
          />

          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Logged in as <strong>{currentUser.name}</strong>
              </div>
              <button
                onClick={() => { store.logoutUser(); setMobileMenuOpen(false); }}
                style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #f87171', color: '#f87171', borderRadius: 'var(--radius-md)', padding: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button onClick={() => { store.openAuthModal('login'); setMobileMenuOpen(false); }} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                <LogIn size={15} /> Sign In
              </button>
              <button onClick={() => { store.openAuthModal('signup'); setMobileMenuOpen(false); }} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <UserPlus size={15} /> Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
