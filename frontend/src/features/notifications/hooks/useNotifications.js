
import { useMemo, useState } from "react";
import { mockNotifications } from "../data/mockNotifications.js";
import {
  filterNotifications,
  sortNotifications,
} from "../utils/notificationUtils.js";

export default function useNotifications() {
  const [notifications, setNotifications] = useState(() =>
    sortNotifications(mockNotifications)
  );

  const [filter, setFilter] = useState("all");

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(
    () => filterNotifications(notifications, filter),
    [notifications, filter]
  );

  function markAsRead(id) {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  }

  function markAllAsRead() {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    );
  }

  function removeNotification(id) {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  function clearReadNotifications() {
    setNotifications((previous) =>
      previous.filter((item) => !item.read)
    );
  }

  return {
    notifications,
    filteredNotifications,
    unreadCount,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearReadNotifications,
  };
}
