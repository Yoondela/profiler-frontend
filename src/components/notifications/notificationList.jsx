import { useNotifications } from '@/api/context/notificationContext';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import { respondToInvite } from '@/api/sync/SyncInvite';

export default function NotificationList() {
  const { notifications, loading, markAsRead } = useNotifications();

  console.log('NotificationList: notifications', notifications);

  if (loading) return <div>Loading...</div>;

  async function handleAction(nId, action) {
    try {
      await respondToInvite(nId, action);
      markAsRead(nId);
    } catch (err) {
      console.error('Failed to respond to invite', err);
    }
  }

  return (
    <div className="flex flex-col divide-y">
      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => markAsRead(n.id)}
          className={`
        group cursor-pointer px-4 py-4 mx-1 transition
        border-none
        hover:bg-gray-50
        ${n.status === 'unread' ? 'bg-blue-50' : 'bg-background'}
      `}
        >
          <div className="flex items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="mt-0 text-sm text-muted-foreground">
                  {n.message}
                </p>
                <p className="text-xs">{formatTimeAgo(n.createdAt)}</p>
              </div>
              {n.actions && (
                <div className="mt-0 flex items-center gap-2">
                  {n.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        handleAction(n.entityId, action);
                        e.stopPropagation();
                      }}
                      className="px-3 py-1 text-sm text-blue-300 hover:underline cursor-pointer"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
