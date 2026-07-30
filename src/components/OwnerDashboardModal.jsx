import React from 'react';
import { X, Crown, Edit3, Trash2, Pin, ShieldCheck, Activity, Users, BookOpen, Heart } from 'lucide-react';

export const OwnerDashboardModal = ({
  posts,
  currentUser,
  securityLogs,
  onClose,
  onEditPost,
  onDeletePost,
  onTogglePin
}) => {
  const isOwner = currentUser.name === 'Aaditya Kumar' || currentUser.role === 'owner';
  if (!isOwner) return null;

  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalAuthors = new Set(posts.map(p => p.authorName)).size;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', padding: '0' }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 28px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, var(--bg-glass) 100%)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.25)',
              border: '1px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <Crown size={24} />
            </div>
            <div>
              <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>
                Master Panel — Platform Owner Aaditya Kumar
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Master Administrative Control • Full Edit & Moderation Authority Over All Works
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '28px', maxHeight: '80vh', overflowY: 'auto' }}>
          
          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
              <BookOpen size={20} style={{ color: 'var(--accent-primary)', marginBottom: '4px' }} />
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{posts.length}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Total Works Published</div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
              <Users size={20} style={{ color: '#60a5fa', marginBottom: '4px' }} />
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalAuthors}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Active Publishers</div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
              <Heart size={20} style={{ color: '#ec4899', marginBottom: '4px' }} />
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalLikes}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Reader Likes</div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
              <ShieldCheck size={20} style={{ color: '#34d399', marginBottom: '4px' }} />
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>Aaditya Kumar</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Master Owner Verified</div>
            </div>
          </div>

          {/* Master Content Table */}
          <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: '#fbbf24' }} /> All Publications (Master Override Actions)
          </h3>

          <div className="glass-panel" style={{ overflowX: 'auto', marginBottom: '32px' }}>
            {posts.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No publications exist on the platform yet. As owner Aaditya Kumar, you can publish the first work or await user submissions!
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px' }}>Work Title</th>
                    <th style={{ padding: '12px 16px' }}>Publisher</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Featured Banner</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Owner Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>
                        {p.title}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {p.authorName}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="badge badge-category">{p.category.replace('_', ' ')}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {p.isPinned ? (
                          <span className="badge badge-owner"><Crown size={10} /> Pinned</span>
                        ) : (
                          <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>Standard</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => {
                              onClose();
                              onEditPost(p);
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.4)' }}
                            title="Master Edit (Overrides Author restriction)"
                          >
                            <Edit3 size={12} /> Master Edit
                          </button>

                          <button
                            onClick={() => onTogglePin(p.id)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            title="Toggle Banner Pin"
                          >
                            <Pin size={12} />
                          </button>

                          <button
                            onClick={() => onDeletePost(p.id)}
                            className="btn btn-danger"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            title="Delete Work"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Security & Audit Logs */}
          <h3 className="font-heading" style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
            🔒 Security Audit & Permission Log
          </h3>
          <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', maxHeight: '160px', overflowY: 'auto' }}>
            {securityLogs.map(log => (
              <div key={log.id} style={{ marginBottom: '6px', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--accent-gold)' }}>[{log.time}]</span> {log.text}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
