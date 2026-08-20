"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ReactionType } from "@/types/database";

type Props = {
  postId: string;
  userId: string | null;
  initialLikes: number;
  initialDislikes: number;
  initialReaction: ReactionType | null;
};

export function LikeDislikeButtons({
  postId,
  userId,
  initialLikes,
  initialDislikes,
  initialReaction,
}: Props) {
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [reaction, setReaction] = useState<ReactionType | null>(initialReaction);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyDelta = (previous: ReactionType | null, next: ReactionType | null) => {
    if (previous === "like") setLikes((count) => count - 1);
    if (previous === "dislike") setDislikes((count) => count - 1);
    if (next === "like") setLikes((count) => count + 1);
    if (next === "dislike") setDislikes((count) => count + 1);
  };

  const handleReact = async (target: ReactionType) => {
    if (!userId) {
      router.push("/connexion");
      return;
    }
    if (isSubmitting) return;

    const previous = reaction;
    const next = previous === target ? null : target;

    setIsSubmitting(true);
    applyDelta(previous, next);
    setReaction(next);

    const supabase = createClient();

    if (next === null) {
      await supabase
        .from("post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);
    } else {
      await supabase
        .from("post_reactions")
        .upsert(
          { post_id: postId, user_id: userId, reaction: next },
          { onConflict: "post_id,user_id" },
        );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => handleReact("like")}
        aria-pressed={reaction === "like"}
        className={`rounded border px-3 py-1.5 font-utility text-sm ${
          reaction === "like"
            ? "border-zellige bg-zellige text-chaux"
            : "border-nuit/30 text-nuit hover:border-zellige hover:text-zellige"
        }`}
      >
        J&apos;aime · {likes}
      </button>
      <button
        type="button"
        onClick={() => handleReact("dislike")}
        aria-pressed={reaction === "dislike"}
        className={`rounded border px-3 py-1.5 font-utility text-sm ${
          reaction === "dislike"
            ? "border-argile bg-argile text-chaux"
            : "border-nuit/30 text-nuit hover:border-argile hover:text-argile"
        }`}
      >
        Je n&apos;aime pas · {dislikes}
      </button>
    </div>
  );
}
