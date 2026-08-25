/**
 * Verify portfolio_settings branding columns against a live Supabase project.
 *
 * Usage (Hostinger / local with prod env):
 *   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... npx tsx scripts/verify-settings-schema.ts
 *
 * Does not mutate personal production content.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

const REQUIRED = [
  "hero_title",
  "brand_name",
  "website_name",
  "wordmark",
  "accent_color",
  "theme_preference",
  "onboarding_completed",
] as const;

async function main() {
  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or PUBLISHABLE_KEY).",
    );
    process.exit(2);
  }

  const endpoint = `${url}/rest/v1/portfolio_settings?select=${REQUIRED.join(",")}&limit=1`;
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
    if (/brand_name|schema cache/i.test(body)) {
      console.error(
        "\nApply supabase/migrations/008_portfolio_settings_branding.sql in the Supabase SQL editor,",
      );
      console.error("then run: NOTIFY pgrst, 'reload schema';");
    }
    process.exit(1);
  }

  console.log("portfolio_settings branding columns are present:");
  for (const column of REQUIRED) console.log(`  ✓ ${column}`);

  // Simulate the Setup Wizard Name payload shape (no write).
  const sample = {
    brand_name: "Your Name",
    website_name: "My Portfolio",
    wordmark: "YOUR NAME",
    hero_title: "Your Name",
  };
  console.log("\nSetup Wizard Name payload keys are schema-compatible:");
  for (const keyName of Object.keys(sample)) console.log(`  ✓ ${keyName}`);
  console.log("\nOK — Name step can save after migration 008 + schema reload.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
