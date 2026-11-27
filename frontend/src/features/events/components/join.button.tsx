"use client";

import { Event } from "../types";
import useMembership from "../hooks/use.membership.event";
import { Button } from "@/components/ui/button";
import { EventUserOperation } from "../types";
import useJoin from "../hooks/use.join.events";
import { useRouter } from "next/navigation";
import { Me } from "@/lib/api/types";

type JoinButtonProps = {
  event: Event;
  me: Me | undefined;
  note: string;
};

export default function JoinButton({ event, me, note }: JoinButtonProps) {
  const router = useRouter();

  const { data, isError: isJoinedError, isLoading: isJoinedLoading } = useMembership(event.id);

  const isJoined = data?.isJoined;

  const mutation = useJoin();

  const handleSubmit = (operation: EventUserOperation = "join") => {
    mutation.mutate({
      eventId: event.id,
      operation,
      note,
    });
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
    <Button
      onClick={() => {
        isJoined !== undefined && !isJoined && handleSubmit();
        isJoined !== undefined && isJoined && handleSubmit("leave");
      }}
    >
      {isJoined !== undefined && !isJoined ? "Join" : "Leave"}
    </Button>
  );
}
