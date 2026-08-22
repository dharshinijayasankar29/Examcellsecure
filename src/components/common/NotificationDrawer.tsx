import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const { notifications, isNotificationOpen, setIsNotificationOpen, markNotificationAsRead } = useApp();

  if (!isNotificationOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} className="text-green-600" />;
      case 'warning': return <AlertTriangle size={18} className="text-amber-600" />;
      case 'alert': return <AlertCircle size={18} className="text-red-600" />;
      default: return <Info size={18} className="text-blue-600" />;
    }
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsNotificationOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Notifications & Activity Feed</h3>
          <button className="close-btn" onClick={() => setIsNotificationOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {notifications.length === 0 ? (
            <div className="empty-notif">No new notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? 'unread' : ''}`}
                onClick={() => markNotificationAsRead(n.id)}
              >
                <div className="notif-icon">{getIcon(n.type)}</div>
                <div className="notif-details">
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-message">{n.message}</div>
                  <div className="notif-time">{n.timestamp}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(2px);
          z-index: 100;
          display: flex;
          justify-content: flex-end;
        }

        .drawer-content {
          width: 380px;
          height: 100%;
          background: var(--bg-secondary);
          border-left: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
          animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .drawer-header {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .drawer-header h3 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .notif-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .notif-item.unread {
          border-left: 3px solid var(--brand-accent);
          background: var(--bg-secondary);
        }

        .notif-item:hover {
          border-color: var(--brand-accent);
        }

        .notif-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .notif-message {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .notif-time {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 6px;
        }

        .empty-notif {
          text-align: center;
          color: var(--text-muted);
          padding: 40px 0;
        }
      `}</style>
    </div>
  );
};
