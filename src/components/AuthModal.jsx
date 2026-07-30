import React, { useState } from 'react';
import { X, Crown, Feather, BookOpen, Key, Lock, Mail, User, ShieldCheck, ArrowRight, Info, ShieldAlert } from 'lucide-react';

export const AuthModal = ({ initialTab = 'login', onClose, onLoginUser, onRegisterUser, onLoginOwner }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [ownerPassword, setOwnerPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLoginUser({ email: loginEmail, password: loginPassword });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      alert('Please fill out all registration fields.');
      return;
    }
    onRegisterUser({
      name: signupName,
      email: signupEmail,
      password: signupPassword
    });
  };

  const handleOwnerSubmit = (e) => {
    e.preventDefault();
    if (!ownerPassword.trim()) {
      alert('Please enter the Platform Owner Password.');
      return;
    }
    onLoginOwner({ password: ownerPassword });
  };

  const isOwnerTabVisible = initialTab === 'owner' || activeTab === 'owner';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          padding: '0',
          background: activeTab === 'owner' ? 'linear-gradient(135deg, rgba(30, 22, 10, 0.96) 0%, var(--bg-secondary) 100%)' : 'var(--bg-secondary)',
          border: activeTab === 'owner' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-highlight)'
        }}
      >
        {/* Modal Top Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-glass)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: activeTab === 'owner' ? 'rgba(245, 158, 11, 0.25)' : 'var(--accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: activeTab === 'owner' ? '#f59e0b' : 'var(--accent-primary)'
            }}>
              {activeTab === 'owner' ? <Crown size={22} /> : <User size={20} />}
            </div>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, color: activeTab === 'owner' ? '#fbbf24' : 'var(--text-main)' }}>
                {activeTab === 'owner' ? 'Platform Owner Portal' : activeTab === 'signup' ? 'Create Your Account' : 'User Sign In'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-sans)' }}>
                {activeTab === 'owner' ? 'Restricted exclusively to Aaditya Kumar' : 'Join Aetheria Creative Sanctuary'}
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Public Tab Switcher (Hides Owner Tab from Public View) */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-input)', fontFamily: 'var(--font-sans)' }}>
          <button
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: activeTab === 'login' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'login' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'login' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'login' ? '2px solid var(--accent-primary)' : 'none'
            }}
          >
            Sign In
          </button>

          <button
            onClick={() => setActiveTab('signup')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: activeTab === 'signup' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'signup' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'signup' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'signup' ? '2px solid var(--accent-primary)' : 'none'
            }}
          >
            Create Account
          </button>

          {/* Owner Tab is ONLY rendered if accessing via secret owner route */}
          {isOwnerTabVisible && (
            <button
              onClick={() => setActiveTab('owner')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: activeTab === 'owner' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: activeTab === 'owner' ? '#fbbf24' : 'var(--text-muted)',
                fontWeight: activeTab === 'owner' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                borderBottom: activeTab === 'owner' ? '2px solid #f59e0b' : 'none'
              }}
            >
              <Crown size={14} /> Owner Portal
            </button>
          )}
        </div>

        {/* Tab 1: Public User Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="your.email@domain.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder="Enter your password..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', justifyContent: 'center', marginTop: '8px' }}>
              <span>Sign In to Account</span> <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px', fontFamily: 'var(--font-sans)' }}>
              Don't have an account yet?{' '}
              <button type="button" onClick={() => setActiveTab('signup')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer' }}>
                Sign Up Here
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Public User Sign Up */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ background: 'var(--bg-hover)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-highlight)', fontSize: '0.8rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-sans)' }}>
              <Info size={16} />
              <span>All registered members can read all works AND publish their own creative works!</span>
            </div>

            <div className="form-group">
              <label className="form-label">Your Name / Pen Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. Maya Lin or Rohan Sharma"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Set Your Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder="Choose your password..."
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', justifyContent: 'center', marginTop: '8px' }}>
              <span>Create Account & Sign In</span> <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Tab 3: Secret Owner Portal (Rendered ONLY via secret owner URL) */}
        {activeTab === 'owner' && (
          <form onSubmit={handleOwnerSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-sans)'
            }}>
              <ShieldAlert size={18} />
              <span>Password Protected Owner Portal. Restricted exclusively to <strong>Aaditya Kumar</strong>.</span>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#fbbf24' }}>Platform Owner Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#f59e0b' }} />
                <input
                  type="email"
                  value="aaditya@aetheria.com"
                  readOnly
                  className="form-input"
                  style={{ paddingLeft: '40px', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24', background: 'rgba(20, 15, 8, 0.8)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#fbbf24' }}>Owner Security Password *</label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#f59e0b' }} />
                <input
                  type="password"
                  placeholder="Enter your Owner Password..."
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                  autoFocus
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', justifyContent: 'center', background: 'linear-gradient(135deg, #f59e0b, #d97706)', marginTop: '8px' }}>
              <ShieldCheck size={18} />
              <span>Verify & Unlock Owner Access</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
