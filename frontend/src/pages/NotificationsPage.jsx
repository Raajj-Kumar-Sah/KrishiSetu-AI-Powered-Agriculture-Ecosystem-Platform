import { Bell, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/app/hooks";
import { useMarkNotificationReadMutation, useNotificationsQuery } from "@/api/apiSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { resolveItems } from "@/lib/utils";

export default function NotificationsPage() {
  const { data, isLoading } = useNotificationsQuery();
  const realtime = useAppSelector((state) => state.notification.realtimeItems);
  const [markRead] = useMarkNotificationReadMutation();
  const items = [...realtime, ...resolveItems(data)];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader title="Notifications" description="Realtime and persisted notifications with unread state from the backend." />
      {!items.length && !isLoading && <EmptyState title="No notifications" />}
      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={item._id || item.id || index} className="p-4">
            <div className="flex gap-4">
              <span className="rounded-xl bg-green-50 p-3 text-primary"><Bell className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{item.title || item.type || "Notification"}</h3>
                  {!item.isRead && <Badge variant="accent">Unread</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.message || item.body}</p>
              </div>
              {item._id && !item.isRead && (
                <Button variant="outline" size="icon" onClick={() => markRead(item._id).unwrap().then(() => toast.success("Marked read"))} aria-label="Mark read">
                  <CheckCheck className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
