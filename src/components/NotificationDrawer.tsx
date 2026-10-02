import React from 'react';
import { X, Bell, Check, Sparkles, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { Notification, UserRole } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  userRole: UserRole;
  currentUserId: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectItem: (itemId: number) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  userRole,
  currentUserId,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectItem
}) => {
  if (!isOpen) return null;

  // Filter notifications for current user/role
  const userNotifications = notifications.filter(n => {
    if (userRole === 'admin') return n.user_role === 'admin';
    return n.user_role === 'student' && n.user_id === currentUserId;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-neutral-800" />
              <h2 className="text-base font-bold text-neutral-900">
                Campus Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold bg-neutral-900 text-white rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors font-medium cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {userNotifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400 space-y-2">
                <Bell className="w-8 h-8 text-neutral-300 mx-auto" />
                <p>No notifications at the moment.</p>
              </div>
            ) : (
              userNotifications.map(notif => {
                const getIcon = () => {
                  switch (notif.type) {
                    case 'match_alert':
                      return <Sparkles className="w-4 h-4 text-amber-600" />;
                    case 'claim_update':
                      return <Shield className="w-4 h-4 text-blue-600" />;
                    default:
                      return <Bell className="w-4 h-4 text-neutral-600" />;
                  }
                };

                return (
                  <div
                    key={notif.notification_id}
                    onClick={() => {
                      if (!notif.read) onMarkAsRead(notif.notification_id);
                      if (notif.link_item_id) {
                        onSelectItem(notif.link_item_id);
                        onClose();
                      }
                    }}
                    className={`p-4 rounded-xl border text-xs transition-all cursor-pointer space-y-1.5 ${
                      notif.read
                        ? 'bg-neutral-50/50 border-neutral-100 text-neutral-600 opacity-80'
                        : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getIcon()}
                        <h4 className="font-bold text-neutral-900">{notif.title}</h4>
                      </div>
                      <span className="text-[11px] text-neutral-400 font-mono tabular-nums shrink-0">
                        {notif.timestamp.split(' ')[1]}
                      </span>
                    </div>

                    <p className="text-neutral-600 leading-relaxed">{notif.message}</p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{notif.timestamp.split(' ')[0]}</span>
                      {notif.link_item_id && (
                        <span className="font-medium text-neutral-900 flex items-center gap-0.5 hover:underline">
                          View Item <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 text-[11px] text-neutral-400 text-center">
            Automated alerts sent by UniFound Notification Dispatcher
          </div>

        </div>
      </div>
    </div>
  );
};
