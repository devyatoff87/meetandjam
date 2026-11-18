"use client";

import { useMe } from "@/features/auth/hooks/use-me";
import { Event } from "../types";
import useMembership from "../hooks/use.membership.event";
import { Button } from "@/components/ui/button";

export default function JoinButton({ event }: { event: Event }) {
  const { data: me, isLoading: isMeLoading } = useMe();
  const { data: membership, isError, isLoading: isMembershipLoading } = useMembership(event.id);
  const isJoined = membership?.isJoined;

  if (me?.id === event.ownerId || isMeLoading) {
    return null;
  }

  if (isMembershipLoading) {
    return <Button disabled>Loading...</Button>;
  }

  if (isError) {
    return <Button disabled>Error occurred</Button>;
  }

  return <Button>{isJoined ? "Leave" : "Join"}</Button>;
}
