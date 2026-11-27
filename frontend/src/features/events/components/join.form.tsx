"use client";

import { Event } from "../types";
import useMembership from "../hooks/use.membership.event";
import { Button } from "@/components/ui/button";
import { EventUserOperation } from "../types";
import useJoin from "../hooks/use.join.events";
import { useRouter } from "next/navigation";
import { Me } from "@/lib/api/types";
import { useState } from "react";

type JoinButtonProps = {
  event: Event;
  me: Me | undefined;
};

export default function JoinForm({ event, me }: JoinButtonProps) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const { data, isError: isJoinedError, isLoading: isJoinedLoading } = useMembership(event.id);

  const isJoined = data?.isJoined;

  const mutation = useJoin();

  const handleSubmit = (operation: EventUserOperation = "join") => {
    if (!note && note.length < 2) {
      setMessage("This form field is required");
      setError(true);
      return;
    }
    mutation.mutate({
      eventId: event.id,
      note,
    });
    setError(false);
    setMessage("You joined the event successfully");
    setTimeout(() => {
      setMessage("");
    }, 5000);
    setNote("");
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
        isJoined !== undefined && !isJoined && handleSubmit();
        isJoined !== undefined && isJoined && handleSubmit("leave");
      }}
    >
      <Button>{isJoined !== undefined && !isJoined ? "Join" : "Leave"}</Button>
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
      <div className={error ? "text-red-500" : "text-green-500"}>{message && message}</div>
    </form>
  );
}
