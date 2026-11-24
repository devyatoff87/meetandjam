"use client";

import { Event } from "../types";
import useMembership from "../hooks/use.membership.event";
import { Button } from "@/components/ui/button";
import { EventUserOperation } from "../types";
import useJoin from "../hooks/use.join.events";

type JoinButtonProps = {
  event: Event;
  callback?: (msg: string) => void;
};

export default function JoinButton({ event, callback }: JoinButtonProps) {
  const { data, error: isJoinedError, isLoading: isJoinedLoading } = useMembership(event.id);

  const isJoined = data?.isJoined;

  const mutation = useJoin();

  if (isJoinedLoading) {
    return <Button disabled>Loading...</Button>;
  }

  if (isJoinedError) {
    return <Button disabled>Error occurred</Button>;
  }

  const handleSubmit = (operation: EventUserOperation = "join") => {
    mutation.mutate({
      eventId: event.id,
      operation,
    });
  };

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
