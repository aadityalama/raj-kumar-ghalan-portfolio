/**
 * CMS coverage invariants (no live DB required).
 * Run: npm run verify:cms-coverage
 */
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

function sectionFiles() {
  return readdirSync(join(root, "components/sections")).filter((name) => name.endsWith(".tsx"));
}

function testPublicComponentsAvoidConfigSiteContent() {
  const forbiddenImports = [
    "components/sections/hero.tsx",
    "components/sections/about.tsx",
    "components/sections/experience.tsx",
    "components/sections/market.tsx",
    "components/sections/content-creation.tsx",
    "components/sections/career-timeline.tsx",
    "components/sections/featured-projects.tsx",
    "components/sections/experience-photos.tsx",
  ];

  for (const file of forbiddenImports) {
    const text = read(file);
    assert.equal(
      text.includes('@/config/site"') || text.includes("@/config/site'"),
      false,
      `${file} must not import demo content from config/site`,
    );
  }
}

function testHomepageUsesCmsHelpers() {
  const page = read("app/page.tsx");
  assert.match(page, /getPublicPortfolio/);
  assert.match(page, /sectionMeta/);
  assert.match(page, /journeyStagesByKind/);
  assert.match(page, /GalleryCta settings=\{portfolio\.settings\}/);
}

function testCmsTypesAndMigrationExist() {
  const types = read("lib/cms/types.ts");
  assert.match(types, /journeyStages/);
  assert.match(types, /hero_primary_cta_text/);
  assert.match(types, /JourneyStageRow/);

  const migration = read("supabase/migrations/010_full_cms_coverage.sql");
  assert.match(migration, /portfolio_journey_stages/);
  assert.match(migration, /portfolio_experience_photos/);
  assert.match(migration, /hero_primary_cta_text/);
  assert.match(migration, /is_owner_site = true/);
}

function testOwnerDefaultsPreserveRajIdentity() {
  const ownerDefaults = read("lib/cms/owner-defaults.ts");
  assert.match(ownerDefaults, /Raj Kumar Ghalan/);
  assert.match(ownerDefaults, /KP Electric/);
  assert.match(ownerDefaults, /FIRE Nepal/);
  assert.doesNotMatch(ownerDefaults, /Your Name/);
  assert.doesNotMatch(ownerDefaults, /Example Studio/);
}

function testAdminNavStructure() {
  const shell = read("app/admin/_components/admin-shell.tsx");
  for (const label of [
    "Overview",
    "Homepage",
    "About",
    "Experience",
    "Projects",
    "Skills",
    "Gallery",
    "Content / YouTube",
    "Market / NEPSE",
    "Social Links",
    "Navigation",
    "Footer",
    "Site Settings",
  ]) {
    assert.match(shell, new RegExp(label.replace("/", "\\/")));
  }
}

function testActionsCoverNewEntities() {
  const actions = read("lib/cms/actions.ts");
  assert.match(actions, /saveJourneyStageAction/);
  assert.match(actions, /saveExperiencePhotoAction/);
  assert.match(actions, /hero_primary_cta_text/);
  assert.match(actions, /portfolio_journey_stages/);
}

function testPublicFetchIncludesJourneyData() {
  const pub = read("lib/cms/public.ts");
  assert.match(pub, /portfolio_journey_stages/);
  assert.match(pub, /portfolio_experience_photos/);
  assert.match(pub, /enrichOwnerSettings/);
}

function testSectionComponentsAcceptCmsProps() {
  assert.match(read("components/sections/skills.tsx"), /eyebrow\?:/);
  assert.match(read("components/sections/gallery-cta.tsx"), /settings: SettingsRow/);
  assert.match(read("app/gallery/page.tsx"), /settings\.gallery_page_title/);
}

function main() {
  testPublicComponentsAvoidConfigSiteContent();
  testHomepageUsesCmsHelpers();
  testCmsTypesAndMigrationExist();
  testOwnerDefaultsPreserveRajIdentity();
  testAdminNavStructure();
  testActionsCoverNewEntities();
  testPublicFetchIncludesJourneyData();
  testSectionComponentsAcceptCmsProps();
  console.log("verify-cms-coverage: all checks passed");
}

main();
