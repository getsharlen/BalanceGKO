import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getSupabaseConfig(request) {
  const configuredUrl =
    process.env.SUPABASE_URL || request.headers.get("x-supabase-url") || "";
  const configuredKey =
    process.env.SUPABASE_ANON_KEY || request.headers.get("apikey") || "";

  if (!configuredUrl || !configuredKey) {
    return {
      error: NextResponse.json(
        { message: "Atur URL Supabase dan publishable/anon key terlebih dahulu." },
        { status: 400 },
      ),
    };
  }

  let url;
  try {
    url = new URL(configuredUrl);
  } catch {
    return {
      error: NextResponse.json(
        { message: "URL Supabase tidak valid." },
        { status: 400 },
      ),
    };
  }

  if (
    url.protocol !== "https:" ||
    !url.hostname.endsWith(".supabase.co") ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    return {
      error: NextResponse.json(
        { message: "Gunakan URL project Supabase HTTPS yang valid." },
        { status: 400 },
      ),
    };
  }

  return { url: url.origin, key: configuredKey };
}

async function supabaseRequest(request, path, options = {}) {
  const config = getSupabaseConfig(request);
  if (config.error) return config.error;

  try {
    const response = await fetch(`${config.url}/rest/v1/team_balancer_data${path}`, {
      ...options,
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        Accept: "application/json",
        ...options.headers,
      },
      cache: "no-store",
    });
    const responseBody = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            responseBody || `Supabase merespons dengan status ${response.status}.`,
        },
        { status: response.status },
      );
    }

    return new NextResponse(responseBody || null, {
      status: response.status,
      headers: responseBody ? { "Content-Type": "application/json" } : undefined,
    });
  } catch (error) {
    console.error("Permintaan ke Supabase gagal.", error);
    return NextResponse.json(
      { message: "Tidak dapat terhubung ke Supabase." },
      { status: 502 },
    );
  }
}

export async function GET(request) {
  const result = await supabaseRequest(
    request,
    "?id=eq.latest_state&select=participants,teams&limit=1",
  );
  if (result.status !== 200) return result;

  const rows = await result.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    participants: rows[0].participants,
    teams: rows[0].teams,
  });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Body permintaan harus berupa JSON yang valid." },
      { status: 400 },
    );
  }

  if (!Array.isArray(body?.participants) || !Array.isArray(body?.teams)) {
    return NextResponse.json(
      { message: "Data peserta dan tim harus berupa array." },
      { status: 400 },
    );
  }

  return supabaseRequest(request, "?on_conflict=id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      id: "latest_state",
      participants: body.participants,
      teams: body.teams,
      updated_at: new Date().toISOString(),
    }),
  });
}
