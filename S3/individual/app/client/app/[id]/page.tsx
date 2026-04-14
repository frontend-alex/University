import Link from "next/link";
import { notFound } from "next/navigation";

import { ApiError, getUser } from "@/lib/api";

type UserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  let user;
  let errorMessage = "";
  try {
    user = await getUser(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    errorMessage = error instanceof ApiError ? (error.detail ?? error.message) : "Unexpected error";
  }

  if (!user) {
    return (
      <main className="mx-auto min-h-svh max-w-3xl p-6">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          Back to barbershop dashboard
        </Link>
        <section className="mt-4 rounded-lg border border-destructive/40 p-6">
          <h1 className="text-xl font-semibold">Could not load booking</h1>
          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
        </section>
      </main>
    );
  }

  const probabilityPercent = (user.probability * 100).toFixed(2);
  const riskLabel = user.prediction === 1 ? "High no-show risk" : "Low no-show risk";

  return (
    <main className="mx-auto min-h-svh max-w-3xl p-6">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        Back to barbershop dashboard
      </Link>

      <section className="mt-4 rounded-lg border p-6">
        <h1 className="text-2xl font-semibold">Booking {user.id}</h1>
        <p className="mt-1 text-sm text-muted-foreground">No-show prediction details</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md border p-4">
            <p className="text-xs text-muted-foreground">Probability</p>
            <p className="mt-1 text-xl font-semibold">{probabilityPercent}%</p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-xs text-muted-foreground">Prediction</p>
            <p className="mt-1 text-xl font-semibold">{riskLabel}</p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-xs text-muted-foreground">Threshold</p>
            <p className="mt-1 text-xl font-semibold">{user.threshold.toFixed(3)}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-medium">Top factors behind this score</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Positive impact increases no-show risk. Negative impact lowers it.
          </p>
          <div className="mt-3 space-y-2">
            {user.top_factors.map((factor) => {
              const positive = factor.impact >= 0;
              return (
                <div key={factor.feature} className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm">{factor.feature}</span>
                  <span className={positive ? "text-sm font-medium text-red-600" : "text-sm font-medium text-green-600"}>
                    {positive ? "+" : ""}
                    {factor.impact.toFixed(3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
