import { useNotifications } from '@/api/context/notificationContext';

export default function NotificationList() {
  const { notifications, loading, markAsRead } = useNotifications();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {notifications.map((n) => (
        <div
          key={n._id}
          onClick={() => markAsRead(n._id)}
          style={{
            background: n.status === 'unread' ? '#eee' : '#fff',
            padding: '10px',
            marginBottom: '0px',
            cursor: 'pointer',
            borderBottom: '1px solid #fff',
          }}
        >
          <strong>{n.title}</strong>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
