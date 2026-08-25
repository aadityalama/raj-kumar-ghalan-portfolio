/**
 * Verify portfolio_experience.company_logo_url against a live Supabase project.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... npx tsx scripts/verify-experience-logo-schema.ts
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

async function main() {
  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or PUBLISHABLE_KEY).",
    );
    process.exit(2);
  }

  const endpoint = `${url}/rest/v1/portfolio_experience?select=id,company,company_logo_url&limit=1`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });

  const body = await response.text();
  if (!response.ok) {
    console.error("Schema probe failed:", response.status, body);
    if (/company_logo_url|schema cache/i.test(body)) {
      console.error(
        "\nApply supabase/migrations/009_experience_company_logo.sql in the Supabase SQL editor,",
      );
      console.error("then run: NOTIFY pgrst, 'reload schema';");
    }
    process.exit(1);
  }

  console.log("portfolio_experience.company_logo_url is present.");
  console.log("OK — Experience company logos can be saved after migration 009 + schema reload.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
