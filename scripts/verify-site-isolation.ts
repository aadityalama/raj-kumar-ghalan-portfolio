/**
 * Site isolation invariants (no live DB required).
 * Run: npx tsx scripts/verify-site-isolation.ts
 */
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd());

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

function hostCandidates(host: string) {
  const normalized = String(host || "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
  if (!normalized) return [] as string[];
  const candidates = [normalized];
  if (normalized.startsWith("www.")) {
    candidates.push(normalized.slice(4));
  } else {
    candidates.push(`www.${normalized}`);
  }
  return [...new Set(candidates)];
}

function normalizeHost(value: string | null | undefined) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
}

function cmsSources() {
  const dir = join(root, "lib/cms");
  return readdirSync(dir)
    .filter((name) => name.endsWith(".ts"))
    .map((name) => ({ name, text: read(`lib/cms/${name}`) }));
}

function testHostRoutingHelpers() {
  assert.equal(normalizeHost("RajKumarGhalan.com.np:443"), "rajkumarghalan.com.np");
  const hosts = hostCandidates("www.rajkumarghalan.com.np");
  assert.ok(hosts.includes("www.rajkumarghalan.com.np"));
  assert.ok(hosts.includes("rajkumarghalan.com.np"));
}

function testNoGlobalSettingsSingletonInApp() {
  const forbidden = [
    { file: "lib/cms/actions.ts", patterns: [/\.eq\(\s*["']id["']\s*,\s*1\s*\)/, /^\s*id:\s*1\s*,/m] },
    { file: "lib/cms/admin-data.ts", patterns: [/\.eq\(\s*["']id["']\s*,\s*1\s*\)/] },
    { file: "lib/cms/public.ts", patterns: [/\.eq\(\s*["']id["']\s*,\s*1\s*\)/] },
  ];

  for (const item of forbidden) {
    const text = read(item.file);
    for (const pattern of item.patterns) {
      assert.equal(
        pattern.test(text),
        false,
        `${item.file} must not use global singleton pattern ${pattern}`,
      );
    }
  }
}

function testMutationsRequireSiteId() {
  const actions = read("lib/cms/actions.ts");
  assert.match(actions, /assertSiteId\(siteId\)/);
  assert.match(actions, /onConflict:\s*["']site_id["']/);
  assert.match(actions, /eq\("site_id", siteId\)/);
  assert.match(actions, /Never accept client-provided site_id/);
  assert.match(actions, /function updateOwnedRow/);
  assert.match(actions, /function deleteOwnedRow/);
}

function testPublicAndAdminScopeBySite() {
  const pub = read("lib/cms/public.ts");
  const admin = read("lib/cms/admin-data.ts");
  const auth = read("lib/cms/admin-auth.ts");
  const site = read("lib/cms/site.ts");

  assert.match(pub, /resolvePublicSite/);
  assert.match(pub, /eq\("site_id", siteId\)|withSiteFilter/);
  assert.match(admin, /resolveAdminSite/);
  assert.match(admin, /eq\("site_id", siteId\)/);
  assert.match(auth, /resolveAdminSite\(user\)/);
  assert.match(site, /portfolio_site_domains/);
  assert.match(site, /is_owner_site/);
  assert.match(site, /customer-\$/);
  assert.match(site, /Never trusts client-provided site_id/);
}

function testMigrationIsolation() {
  const migration = read("supabase/migrations/009_site_isolation.sql");
  assert.match(migration, /portfolio_site_domains/);
  assert.match(migration, /portfolio_settings_site_uidx/);
  assert.match(migration, /is_owner_site/);
  assert.match(migration, /rajkumarghalan\.com\.np/);
  assert.match(migration, /create or replace function public\.is_site_editor/);
  assert.equal(
    /is_site_editor[\s\S]*or public\.is_portfolio_admin\(\)/.test(migration),
    false,
    "is_site_editor must not OR is_portfolio_admin after isolation",
  );
}

function testGrantDoesNotAttachCustomersToOwnerSite() {
  const grant = read("supabase/seeds/grant_admin.example.sql");
  assert.equal(
    /where s\.slug = 'default'/.test(grant),
    false,
    "grant example must not attach customers to default/owner site",
  );
  assert.match(grant, /is_owner_site/);
  assert.match(grant, /customer-/);
}

function testCrossTenantScenariosDocumentedInCode() {
  const owner = { siteId: "OWNER", website_name: "Raj Kumar Ghalan", logo: "owner.png" };
  const customerA = { siteId: "A", website_name: "ABC Company", logo: "a.png" };
  const customerB = { siteId: "B", website_name: "XYZ Studio", logo: "b.png" };

  type Row = { website_name: string; logo: string; experience: string[]; projects: string[] };
  const store = new Map<string, Row>([
    [
      owner.siteId,
      {
        website_name: owner.website_name,
        logo: owner.logo,
        experience: ["Owner Role"],
        projects: ["Owner Project"],
      },
    ],
    [
      customerA.siteId,
      { website_name: customerA.website_name, logo: customerA.logo, experience: [], projects: [] },
    ],
    [
      customerB.siteId,
      { website_name: customerB.website_name, logo: customerB.logo, experience: [], projects: [] },
    ],
  ]);

  function updateSite(siteId: string, patch: Partial<Row>) {
    const current = store.get(siteId);
    assert.ok(current, "unknown site");
    store.set(siteId, { ...current, ...patch });
  }

  updateSite("OWNER", { website_name: "Raj Kumar Ghalan Portfolio" });
  assert.equal(store.get("A")!.website_name, "ABC Company");

  updateSite("A", { website_name: "ABC Company Ltd" });
  assert.equal(store.get("OWNER")!.website_name, "Raj Kumar Ghalan Portfolio");

  updateSite("A", { logo: "abc-logo.png" });
  assert.equal(store.get("OWNER")!.logo, "owner.png");

  updateSite("A", { experience: ["Customer Job"], projects: ["Customer App"] });
  assert.deepEqual(store.get("OWNER")!.experience, ["Owner Role"]);
  assert.deepEqual(store.get("OWNER")!.projects, ["Owner Project"]);

  const authenticatedSiteId = "A";
  updateSite(authenticatedSiteId, { website_name: "Still ABC" });
  assert.equal(store.get("OWNER")!.website_name, "Raj Kumar Ghalan Portfolio");

  const domainMap = new Map([
    ["rajkumarghalan.com.np", "OWNER"],
    ["abc.example.com", "A"],
  ]);
  assert.equal(domainMap.get("rajkumarghalan.com.np"), "OWNER");
  updateSite("A", { website_name: "Totally Different Brand" });
  assert.equal(domainMap.get("rajkumarghalan.com.np"), "OWNER");
  assert.equal(
    store.get(domainMap.get("rajkumarghalan.com.np")!)!.website_name,
    "Raj Kumar Ghalan Portfolio",
  );

  updateSite(authenticatedSiteId, { website_name: "Wizard Brand" });
  assert.equal(store.get("OWNER")!.website_name, "Raj Kumar Ghalan Portfolio");
  assert.equal(store.get("B")!.website_name, "XYZ Studio");
  assert.notEqual(store.get("A")!.website_name, store.get("B")!.website_name);

  function readSettings(siteId: string) {
    const row = store.get(siteId);
    assert.ok(row, "refusing unscoped settings read");
    return row;
  }
  assert.equal(readSettings("OWNER").website_name, "Raj Kumar Ghalan Portfolio");
  assert.equal(readSettings("A").website_name, "Wizard Brand");
}

function testCmsSourcesAvoidUnscopedLimitOneSettings() {
  for (const { name, text } of cmsSources()) {
    if (name === "settings-schema.ts") continue;
    const dangerous = /from\(["']portfolio_settings["']\)[\s\S]{0,160}?limit\(\s*1\s*\)/;
    if (!dangerous.test(text)) continue;
    const window = text.match(dangerous)?.[0] || "";
    assert.match(window, /site_id/, `${name} portfolio_settings limit(1) must be site-scoped`);
  }
}

function main() {
  testHostRoutingHelpers();
  testNoGlobalSettingsSingletonInApp();
  testMutationsRequireSiteId();
  testPublicAndAdminScopeBySite();
  testMigrationIsolation();
  testGrantDoesNotAttachCustomersToOwnerSite();
  testCrossTenantScenariosDocumentedInCode();
  testCmsSourcesAvoidUnscopedLimitOneSettings();
  console.log("verify-site-isolation: all checks passed");
}

main();
