import { useNotifications } from '@/api/context/notificationContext';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import { respondToInvite, respondToStaffInvite } from '@/api/sync/SyncInvite';

export default function NotificationList() {
  const { notifications, loading, markAsRead } = useNotifications();

  console.log('NotificationList: notifications', notifications);

  if (loading) return <div>Loading...</div>;

  async function handleAction(nType, nId, action) {
    try {
      switch (nType) {
        case 'CompanyInvite':
          await respondToInvite(nId, action);
          markAsRead(nId);
          break;
        case 'CompanyStaffInvite':
          await respondToStaffInvite(nId, action);
          markAsRead(nId);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Failed to respond to invite', err);
    }
  }

  return (
    <div className="flex w-full flex-col divide-y">
      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => markAsRead(n.id)}
          className={`
        group cursor-pointer px-4 py-4 transition
        border-none
        hover:bg-gray-50
        ${n.status === 'unread' ? 'bg-blue-50' : 'bg-background'}
      `}
        >
          <div className="flex w-full items-start">
            <div className="min-w-0 flex-1">
              <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <p className="mt-0 min-w-0 break-words text-sm text-muted-foreground">
                  {n.message}
                </p>
                <p className="shrink-0 text-xs text-right">{formatTimeAgo(n.createdAt)}</p>
              </div>
              {n.actions && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {n.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        handleAction(n.entityType, n.entityId, action);
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
