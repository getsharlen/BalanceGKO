import { Participant, Team } from "@/lib/types";

export type SupabaseSettings = {
  url: string;
  key: string;
};

export type CloudState = {
  participants: Participant[];
  teams: Team[];
};

function requestHeaders(settings: SupabaseSettings): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-supabase-url": settings.url,
    apikey: settings.key,
  };
}

async function readError(response: Response): Promise<string> {
  const message = await response.text();
  if (!message) return `Permintaan database gagal (${response.status}).`;
  try {
    const parsed = JSON.parse(message) as { message?: string; error?: string };
    return parsed.message ?? parsed.error ?? message;
  } catch {
    return message;
  }
}

export async function saveCloudState(
  settings: SupabaseSettings,
  participants: Participant[],
  teams: Team[],
): Promise<void> {
  const response = await fetch("/api/teams", {
    method: "POST",
    headers: requestHeaders(settings),
    body: JSON.stringify({ participants, teams }),
  });
  if (!response.ok) throw new Error(await readError(response));
}

export async function getCloudState(
  settings: SupabaseSettings,
): Promise<CloudState | null> {
  const response = await fetch("/api/teams", {
    method: "GET",
    headers: requestHeaders(settings),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await readError(response));
  const state = (await response.json()) as CloudState | null;
  if (
    state !== null &&
    (!Array.isArray(state.participants) || !Array.isArray(state.teams))
  ) {
    throw new Error("Format data yang diterima dari database tidak valid.");
  }
  return state;
}
