/**
 * Cloudflare Worker for Creators Hub.
 *
 * - Serves the static Next.js export (./out) via the ASSETS binding.
 * - Adds a same-origin POST /api/contact endpoint that forwards a lead to
 *   Google Apps Script server-to-server. Same-origin means ad blockers don't
 *   block it (they block direct browser calls to script.google.com), and it
 *   returns a real JSON result the form can check.
 *
 * Set GOOGLE_SCRIPT_URL (the Apps Script /exec URL) as a Worker Variable/Secret
 * in Cloudflare — it stays server-side and is never exposed to the browser.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return json({ success: false, error: "Method not allowed" }, 405);
      }
      return handleContact(request, env);
    }

    // everything else → static site
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body.name || "").trim().slice(0, 200);
    const email = String(body.email || "").trim().slice(0, 200);
    const service = String(body.service || "").trim().slice(0, 200);
    const message = String(body.message || "").trim().slice(0, 5000);

    if (!name || !email || !message) {
      return json({ success: false, error: "Please fill in all required fields." }, 400);
    }
    if (!EMAIL_RE.test(email)) {
      return json({ success: false, error: "Please enter a valid email address." }, 400);
    }
    if (!env.GOOGLE_SCRIPT_URL) {
      return json(
        { success: false, error: "Server not configured: missing GOOGLE_SCRIPT_URL." },
        500
      );
    }

    const upstream = await fetch(env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name, email, service, message }),
    });

    if (!upstream.ok) {
      return json({ success: false, error: "Upstream error " + upstream.status }, 502);
    }
    return json({ success: true });
  } catch (err) {
    return json({ success: false, error: String(err) }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
