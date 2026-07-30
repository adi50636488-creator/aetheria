import React, { useState } from 'react';
import { Crown, Feather, BookOpen, ShieldAlert, LogOut, Link as LinkIcon, Copy, Check, X, LogIn, UserPlus, User } from 'lucide-react';
import { store } from '../services/store';

export const RoleSwitcher = ({ currentUser, isOwnerAuthenticated, onOpenAuthModal, onLogoutUser, onOpenOwnerDashboard }) => {
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOwner = currentUser && (currentUser.name === 'Aaditya Kumar' || currentUser.role === 'owner');

  return (
    <>
      <div style={{
        background: 'rgba(15, 17, 26, 0.95)',
        borderBottom: '1px solid var(--border-highlight)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.85rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Left: Active Profile Badge (When logged in) or Guest Badge (When not logged in) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: isOwner
              ? 'rgba(245, 158, 11, 0.2)' 
              : currentUser ? 'rgba(168, 85, 247, 0.2)' : 'rgba(100, 116, 139, 0.2)',
            border: `1px solid ${isOwner ? '#f59e0b' : currentUser ? '#a855f7' : '#64748b'}`,
            fontWeight: 600
          }}>
            {isOwner ? (
              <Crown size={14} style={{ color: '#f59e0b' }} />
            ) : currentUser ? (
              <Feather size={14} style={{ color: '#a855f7' }} />
            ) : (
              <User size={14} style={{ color: '#94a3b8' }} />
            )}
            <span style={{ color: isOwner ? '#fbbf24' : currentUser ? '#c084fc' : '#94a3b8' }}>
              {currentUser ? `Logged In: ${currentUser.name}` : 'Welcome Reader • Sign In or Register to Publish'} {isOwner ? '(PLATFORM OWNER)' : ''}
            </span>
          </div>

          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }} className="hide-mobile">
            {isOwner
              ? '👑 Platform Owner (Aaditya Kumar): Master authority over all works across Aetheria.'
              : currentUser
              ? '✍️ Publisher Scope: You have edit authority over your own authored works.'
              : '📖 Reader Mode: Browse and read all creative works. Sign in to publish!'}
          </span>
        </div>

        {/* Right: Authentication Flow Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* STATE A: User is Logged In -> Show Profile Info + LOG OUT Button */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isOwner && (
                <>
                  <button
                    onClick={onOpenOwnerDashboard}
                    className="btn btn-primary"
                    style={{ padding: '4px 12px', fontSize: '0.75rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                  >
                    <ShieldAlert size={13} /> Master Control Panel
                  </button>

                  <button
                    onClick={() => setShowLinksModal(true)}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fbbf24', borderRadius: 'var(--radius-full)', padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                    title="View Secret Owner URLs"
                  >
                    <LinkIcon size={12} />
                    <span>Secret Links</span>
                  </button>
                </>
              )}

              {/* LOG OUT BUTTON (Shown ONLY when logged in) */}
              <button
                onClick={onLogoutUser}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  borderRadius: 'var(--radius-full)',
                  padding: '5px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="Log Out of Account"
              >
                <LogOut size={13} /> Log Out
              </button>
            </div>
          ) : (
            /* STATE B: User is NOT Logged In -> Show SIGN IN & REGISTER Buttons (Log Out is hidden!) */
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => onOpenAuthModal('login')}
                className="btn btn-secondary"
                style={{ padding: '5px 14px', fontSize: '0.78rem', fontWeight: 600 }}
              >
                <LogIn size={13} /> Sign In
              </button>

              <button
                onClick={() => onOpenAuthModal('signup')}
                className="btn btn-primary"
                style={{ padding: '5px 14px', fontSize: '0.78rem', fontWeight: 700 }}
              >
                <UserPlus size={13} /> Register
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Secret Owner Links Modal */}
      {showLinksModal && isOwner && (
        <div className="modal-overlay" onClick={() => setShowLinksModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
                🔑 Aaditya Kumar Private URL Access
              </h3>
              <button onClick={() => setShowLinksModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '4px' }}>
                  <BookOpen size={16} /> 1. Public Website URL
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Share this public URL with general readers and publishers.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" readOnly value={store.getPublicUrl()} className="form-input" style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }} />
                  <button onClick={() => copyToClipboard(store.getPublicUrl())} className="btn btn-secondary" style={{ padding: '0 12px' }}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', marginBottom: '4px' }}>
                  <Crown size={16} /> 2. Secret Owner Portal Route
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Opening this secret URL displays your private Owner Login portal!
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" readOnly value={store.getOwnerSecretUrl()} className="form-input" style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', borderColor: 'rgba(245, 158, 11, 0.4)' }} />
                  <button onClick={() => copyToClipboard(store.getOwnerSecretUrl())} className="btn btn-primary" style={{ padding: '0 12px', background: '#d97706' }}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setShowLinksModal(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
