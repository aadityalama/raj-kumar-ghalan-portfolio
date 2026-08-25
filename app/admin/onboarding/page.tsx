import Link from "next/link";
import { ActionForm } from "@/app/admin/_components/form-status";
import { saveOnboardingAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

const STEPS = [
  "welcome",
  "name",
  "photo",
  "title",
  "about",
  "social",
  "theme",
  "project",
  "preview",
  "publish",
] as const;

type Step = (typeof STEPS)[number];

/** Demo/template placeholders — never treat personal production names as wizard defaults. */
const NEUTRAL_NAME_VALUES = new Set([
  "",
  "your name",
  "portfolio",
  "my portfolio",
  "creative professional",
]);

function isNeutralSetupValue(value: string | null | undefined) {
  return NEUTRAL_NAME_VALUES.has(String(value || "").trim().toLowerCase());
}

function nextStep(step: Step) {
  const index = STEPS.indexOf(step);
  return STEPS[Math.min(index + 1, STEPS.length - 1)];
}

export default async function AdminOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  await requireAdmin();
  const { settings } = await getAdminCollections();
  const params = await searchParams;
  const step = (STEPS.includes(params.step as Step) ? params.step : "welcome") as Step;
  const next = nextStep(step);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">Setup</p>
      <h1 className="mt-3 text-4xl tracking-[-0.04em]">Welcome to Portfolio CMS</h1>
      <p className="mt-3 text-sm text-muted">
        A short guided setup. You can change everything later in the admin dashboard.
      </p>

      <ol className="mt-6 flex flex-wrap gap-2">
        {STEPS.map((item) => (
          <li key={item}>
            <Link
              href={`/admin/onboarding?step=${item}`}
              className="rounded-full border border-border px-3 py-1 text-xs capitalize text-muted data-[active=true]:border-accent data-[active=true]:text-text"
              data-active={item === step}
            >
              {item}
            </Link>
          </li>
        ))}
      </ol>

      <article className="admin-card mt-8 p-6">
        {step === "welcome" ? (
          <div>
            <h2 className="text-2xl tracking-[-0.03em]">Let’s set up your portfolio</h2>
            <p className="mt-3 text-sm text-muted">
              You’ll add your name, photo, title, about text, social links, accent color, and first project.
            </p>
            <Link href={`/admin/onboarding?step=${next}`} className="admin-link mt-6 inline-flex">
              Continue →
            </Link>
          </div>
        ) : null}

        {step === "name" ? (
          <ActionForm action={saveOnboardingAction} submitLabel="Save & continue">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-2 text-sm">
              Your name
              <input
                className="admin-input"
                name="brand_name"
                defaultValue={
                  isNeutralSetupValue(settings.brand_name) ? "" : settings.brand_name || ""
                }
                placeholder="Your Name"
                required
              />
            </label>
            <label className="mt-4 grid gap-2 text-sm">
              Website name
              <input
                className="admin-input"
                name="website_name"
                defaultValue={
                  isNeutralSetupValue(settings.website_name) ? "" : settings.website_name || ""
                }
                placeholder="My Portfolio"
              />
            </label>
            <p className="mt-3 text-xs text-subtle">
              These fields save to your CMS branding settings. Existing production content is not
              replaced unless you submit new values here.
            </p>
          </ActionForm>
        ) : null}

        {step === "photo" ? (
          <ActionForm action={saveOnboardingAction} submitLabel="Save & continue">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-2 text-sm">
              Profile photo
              <input
                className="admin-input"
                type="file"
                name="hero_image"
                accept="image/jpeg,image/png,image/webp,image/gif"
              />
            </label>
            <p className="mt-3 text-xs text-subtle">JPEG, PNG, WebP, or GIF. Max 5MB.</p>
          </ActionForm>
        ) : null}

        {step === "title" ? (
          <ActionForm action={saveOnboardingAction} submitLabel="Save & continue">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-2 text-sm">
              Professional title
              <input
                className="admin-input"
                name="hero_positioning"
                defaultValue={settings.hero_positioning}
                placeholder="Creative Professional"
                required
              />
            </label>
            <label className="mt-4 grid gap-2 text-sm">
              Hero subtitle
              <input
                className="admin-input"
                name="hero_subtitle"
                defaultValue={settings.hero_subtitle}
                placeholder="Building meaningful digital experiences."
              />
            </label>
          </ActionForm>
        ) : null}

        {step === "about" ? (
          <ActionForm action={saveOnboardingAction} submitLabel="Save & continue">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-2 text-sm">
              About
              <textarea
                className="admin-input min-h-36"
                name="about_body"
                defaultValue={settings.about_body}
                required
              />
            </label>
          </ActionForm>
        ) : null}

        {step === "social" ? (
          <ActionForm action={saveOnboardingAction} submitLabel="Save & continue">
            <input type="hidden" name="next" value={next} />
            {(["linkedin", "github", "instagram", "youtube"] as const).map((platform) => (
              <label key={platform} className="mt-3 grid gap-2 text-sm capitalize">
                {platform}
                <input className="admin-input" name={`social_${platform}`} placeholder="https://" />
              </label>
            ))}
          </ActionForm>
        ) : null}

        {step === "theme" ? (
          <ActionForm action={saveOnboardingAction} submitLabel="Save & continue">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-2 text-sm">
              Accent color (hex)
              <input
                className="admin-input"
                name="accent_color"
                defaultValue={settings.accent_color || "#3DDC97"}
              />
            </label>
            <label className="mt-4 grid gap-2 text-sm">
              Theme
              <select
                className="admin-input"
                name="theme_preference"
                defaultValue={settings.theme_preference || "dark"}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </label>
          </ActionForm>
        ) : null}

        {step === "project" ? (
          <ActionForm action={saveOnboardingAction} submitLabel="Save & continue">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-2 text-sm">
              First project title
              <input className="admin-input" name="project_title" placeholder="Featured Project" />
            </label>
            <label className="mt-4 grid gap-2 text-sm">
              Short description
              <textarea className="admin-input min-h-24" name="project_description" />
            </label>
            <label className="mt-4 grid gap-2 text-sm">
              Category
              <input className="admin-input" name="project_category" placeholder="Product · Design" />
            </label>
            <label className="mt-4 grid gap-2 text-sm">
              Project URL
              <input className="admin-input" name="project_url" placeholder="https://" />
            </label>
          </ActionForm>
        ) : null}

        {step === "preview" ? (
          <div>
            <h2 className="text-2xl tracking-[-0.03em]">Preview your site</h2>
            <p className="mt-3 text-sm text-muted">
              Open the public site in a new tab to review your changes. Content saves immediately when
              you use the admin forms.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/" target="_blank" className="admin-link">
                Open live preview →
              </Link>
              <Link href={`/admin/onboarding?step=publish`} className="admin-link">
                Continue to publish →
              </Link>
            </div>
          </div>
        ) : null}

        {step === "publish" ? (
          <ActionForm action={saveOnboardingAction} submitLabel="Finish setup">
            <input type="hidden" name="step" value="publish" />
            <p className="text-sm text-muted">
              Mark setup as complete. You can keep editing anytime from the dashboard.
            </p>
          </ActionForm>
        ) : null}

        {step !== "welcome" && step !== "preview" && step !== "publish" ? (
          <p className="mt-4 text-xs text-subtle">
            After saving, continue to{" "}
            <Link href={`/admin/onboarding?step=${next}`} className="underline">
              {next}
            </Link>
            .
          </p>
        ) : null}
      </article>
    </div>
  );
}
