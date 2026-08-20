"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Action = "approuver" | "rejeter" | "revision_manuelle";

export function ModerationActions({ postId }: { postId: string }) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<Action | null>(null);

  const handleAction = async (action: Action) => {
    setPendingAction(action);
    await fetch(`/api/posts/${postId}/moderation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setPendingAction(null);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => handleAction("approuver")}
        disabled={pendingAction !== null}
        className="rounded bg-zellige px-3 py-1.5 font-utility text-sm text-chaux hover:opacity-90 disabled:opacity-60"
      >
        Approuver
      </button>
      <button
        type="button"
        onClick={() => handleAction("rejeter")}
        disabled={pendingAction !== null}
        className="rounded bg-argile px-3 py-1.5 font-utility text-sm text-chaux hover:opacity-90 disabled:opacity-60"
      >
        Rejeter
      </button>
      <button
        type="button"
        onClick={() => handleAction("revision_manuelle")}
        disabled={pendingAction !== null}
        className="rounded border border-nuit/30 px-3 py-1.5 font-utility text-sm text-nuit hover:border-nuit disabled:opacity-60"
      >
        À revoir
      </button>
    </div>
  );
}
