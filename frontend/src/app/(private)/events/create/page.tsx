import { EventForm } from "./event.form";

export default function CreateEventPage() {
  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-3xl font-bold">Create event</h1>
      <EventForm />
    </div>
  );
}
