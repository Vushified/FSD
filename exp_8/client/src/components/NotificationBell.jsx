import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    function handleConnect() {
      setConnected(true);
      console.log("Connected to EventHub notifications");
    }

    function handleDisconnect() {
      setConnected(false);
      console.log("Disconnected from EventHub notifications");
    }

    function addNotification(notification) {
      setNotifications((previous) => [
        {
          ...notification,
          id: `${Date.now()}-${Math.random()}`,
        },
        ...previous,
      ]);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("event:created", addNotification);
    socket.on("event:updated", addNotification);
    socket.on("event:deleted", addNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      socket.off("event:created", addNotification);
      socket.off("event:updated", addNotification);
      socket.off("event:deleted", addNotification);

      socket.disconnect();
    };
  }, []);

  function clearNotifications() {
    setNotifications([]);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative rounded-lg px-3 py-2 text-white transition hover:bg-slate-700"
      >
        <span className="text-xl" aria-hidden="true">🔔</span>
        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 max-w-[90vw] rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold">Notifications</h2>

            <button
              type="button"
              onClick={clearNotifications}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Clear all
            </button>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Connection: {connected ? "Connected" : "Disconnected"}
          </p>

          <div className="mt-3 max-h-80 space-y-3 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-lg bg-slate-50 p-3"
                >
                  <p className="text-sm font-medium">
                    {notification.message}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

