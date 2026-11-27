"use client";

import { Event } from "../types";
import useMembership from "../hooks/use.membership.event";
import { Button } from "@/components/ui/button";
import useJoin from "../hooks/use.join.events";
import { useRouter } from "next/navigation";
import { Me } from "@/lib/api/types";
import { useState } from "react";
import useLeave from "../hooks/use.leave.events";
import { cn } from "@/lib/utils";

type JoinButtonProps = {
  event: Event;
  me: Me | undefined;
};

export default function JoinForm({ event, me }: JoinButtonProps) {
  const router = useRouter();

  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const joinMutation = useJoin();
  const leaveMutation = useLeave();

  const { data, isError: isJoinedError, isLoading: isJoinedLoading } = useMembership(event.id);

  const isJoined = data?.isJoined;

  const handleSubmit = () => {
    if (isJoined === undefined) return;

    if (!isJoined) {
      const trimmedNote = note.trim();
      if (trimmedNote.length < 2 || trimmedNote.length > 64) {
        setMessage("Note must be between 2 and 60 characters");
        setError(true);
        return;
      }

      joinMutation.mutate(
        { eventId: event.id, note: trimmedNote },
        {
          onSuccess: () => {
            setError(false);
            setMessage("You joined the event successfully");
            setNote("");
            setTimeout(() => setMessage(""), 5000);
          },
          onError: () => {
            setError(true);
            setMessage("Failed to join event");
          },
        },
      );
      return;
    }

    leaveMutation.mutate(
      { eventId: event.id },
      {
        onSuccess: () => {
          setError(false);
          setMessage("You left the event");
          setTimeout(() => setMessage(""), 5000);
        },
        onError: () => {
          setError(true);
          setMessage("Failed to leave event");
        },
      },
    );
  };

  if (!me)
    return (
      <Button
        onClick={() => {
          router.push("/login");
        }}
      >
        Join Event
      </Button>
    );

  if (me?.id === event.ownerId) return;

  if (isJoinedLoading) {
    return <Button disabled>Loading...</Button>;
  }

  if (isJoinedError) {
    return <Button disabled>Error occurred</Button>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Button>{isJoined !== undefined && !isJoined ? "Join" : "Leave"}</Button>
      {!isJoined && (
        <label htmlFor="note">
          <input
            value={note}
            type="text"
            name="note"
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
          Your role or inventar you might bring with
        </label>
      )}
      <div className={cn("mt-2", error ? "text-red-500" : "text-green-500")}>
        {message && message}
      </div>
    </form>
  );
}
