import Link from "next/link";

import { getUsers } from "@/lib/api";

export default async function Page() {
  const users = await getUsers();

  return (
    <main className="mx-auto min-h-svh max-w-6xl p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Barbershop Bookings</h1>
        <p className="text-sm text-muted-foreground">Click a booking card to view no-show probability.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/${user.id}`}
            className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <h2 className="text-base font-medium">{user.id}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Day: {user.day_of_week}</p>
            <p className="text-sm text-muted-foreground">Channel: {user.booking_channel}</p>
            <p className="text-sm text-muted-foreground">Service: {user.service_type}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
