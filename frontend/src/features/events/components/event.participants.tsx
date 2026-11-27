import useParticipants from "../hooks/use.participants";

export function ParticipantList({ eventId }: { eventId: string }) {
  const { data: participants, isFetching, isError } = useParticipants(eventId);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Some error occured by loading the participants</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Event participants: {participants?.length}</h2>
      {participants!.length < 1 && (
        <div>This events has no participants yet. Feel free to join!</div>
      )}
      {participants?.map((p) => {
        return (
          <div key={p.id}>
            {p.name}: {p.note}
          </div>
        );
      })}
    </div>
  );
}
