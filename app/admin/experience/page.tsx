import Image from "next/image";
import { ActionForm, ConfirmForm } from "@/app/admin/_components/form-status";
import {
  deleteExperienceAction,
  deleteExperiencePhotoAction,
  deleteJourneyStageAction,
  saveExperienceAction,
  saveExperiencePhotoAction,
  saveJourneyStageAction,
  saveSettingsAction,
} from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

function StageList({
  title,
  kind,
  stages,
}: {
  title: string;
  kind: "career" | "experience";
  stages: Array<{
    id: string;
    stage_label: string;
    title: string;
    body: string;
    sort_order: number;
    visible: boolean;
  }>;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl tracking-[-0.03em]">{title}</h2>
      <article className="admin-card mt-4 p-5">
        <h3 className="text-lg">Add stage</h3>
        <ActionForm action={saveJourneyStageAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="kind" value={kind} />
          <input className="admin-input" name="stage_label" placeholder="Stage label" required />
          <input className="admin-input" name="title" placeholder="Title" required />
          <textarea className="admin-textarea sm:col-span-2" name="body" placeholder="Description" />
          <input className="admin-input" type="number" name="sort_order" defaultValue={0} />
        </ActionForm>
      </article>
      <div className="mt-4 grid gap-4">
        {stages.map((stage) => (
          <article key={stage.id} className="admin-card p-5">
            <ActionForm action={saveJourneyStageAction} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={stage.id} />
              <input type="hidden" name="kind" value={kind} />
              <input className="admin-input" name="stage_label" defaultValue={stage.stage_label} />
              <input className="admin-input" name="title" defaultValue={stage.title} />
              <textarea className="admin-textarea sm:col-span-2" name="body" defaultValue={stage.body} />
              <input className="admin-input" type="number" name="sort_order" defaultValue={stage.sort_order} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="visible" defaultChecked={stage.visible} /> Visible
              </label>
            </ActionForm>
            <ConfirmForm action={deleteJourneyStageAction} label="Delete stage">
              <input type="hidden" name="id" value={stage.id} />
            </ConfirmForm>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function AdminExperiencePage() {
  await requireAdmin();
  const { settings, experience, journeyStages, experiencePhotos } = await getAdminCollections();
  const careerStages = journeyStages.filter((item) => item.kind === "career");
  const experienceStageRows = journeyStages.filter((item) => item.kind === "experience");

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Experience</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Manage professional roles, company logos, journey copy, timeline stages, and workplace photos.
      </p>

      <ActionForm action={saveSettingsAction} className="admin-card mt-8 grid gap-4 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Section header</p>
        <label className="grid gap-2 text-sm">
          Journey title
          <input className="admin-input" name="journey_title" defaultValue={settings.journey_title} />
        </label>
        <label className="grid gap-2 text-sm">
          Journey description
          <textarea className="admin-textarea" name="journey_description" defaultValue={settings.journey_description} />
        </label>
        <label className="grid gap-2 text-sm">
          Career timeline eyebrow
          <input className="admin-input" name="career_timeline_eyebrow" defaultValue={settings.career_timeline_eyebrow || "Path"} />
        </label>
        <label className="grid gap-2 text-sm">
          Career timeline title
          <input className="admin-input" name="career_timeline_title" defaultValue={settings.career_timeline_title || "The journey so far"} />
        </label>
      </ActionForm>

      <article className="admin-card mt-8 p-5">
        <h2 className="text-lg">Add role</h2>
        <ActionForm action={saveExperienceAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input className="admin-input" name="company" placeholder="Company" required />
          <input className="admin-input" name="position" placeholder="Position" required />
          <input className="admin-input" name="location" placeholder="Location" />
          <input className="admin-input" name="start_year" placeholder="Start year" />
          <input className="admin-input" name="end_year" placeholder="End year or Present" />
          <textarea className="admin-textarea sm:col-span-2" name="description" placeholder="Description" />
          <input className="admin-input sm:col-span-2" name="technologies" placeholder="Technologies, comma separated" />
          <input className="admin-input" type="file" name="logo_file" accept="image/*" />
          <input className="admin-input" type="number" name="sort_order" defaultValue={0} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" /> Featured
          </label>
        </ActionForm>
      </article>

      <div className="mt-8 grid gap-4">
        {experience.map((item) => (
          <article key={item.id} className="admin-card p-5">
            {item.logo_url ? (
              <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-lg border border-border bg-white p-2">
                <Image src={item.logo_url} alt={`${item.company} logo`} fill className="object-contain" sizes="64px" />
              </div>
            ) : null}
            <ActionForm action={saveExperienceAction} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={item.id} />
              <input className="admin-input" name="company" defaultValue={item.company} />
              <input className="admin-input" name="position" defaultValue={item.position} />
              <input className="admin-input" name="location" defaultValue={item.location || ""} />
              <input className="admin-input" name="start_year" defaultValue={item.start_year} />
              <input className="admin-input" name="end_year" defaultValue={item.end_year} />
              <textarea className="admin-textarea sm:col-span-2" name="description" defaultValue={item.description} />
              <input className="admin-input sm:col-span-2" name="technologies" defaultValue={item.technologies.join(", ")} />
              <label className="grid gap-2 text-sm sm:col-span-2">
                Replace company logo
                <input className="admin-input" type="file" name="logo_file" accept="image/*" />
              </label>
              <input className="admin-input" type="number" name="sort_order" defaultValue={item.sort_order} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" defaultChecked={item.featured} /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="visible" defaultChecked={item.visible !== false} /> Visible
              </label>
            </ActionForm>
            <ConfirmForm action={deleteExperienceAction} label="Delete role">
              <input type="hidden" name="id" value={item.id} />
            </ConfirmForm>
          </article>
        ))}
      </div>

      <StageList title="Experience milestone cards" kind="experience" stages={experienceStageRows} />
      <StageList title="Career timeline stages" kind="career" stages={careerStages} />

      <section className="mt-10">
        <h2 className="text-xl tracking-[-0.03em]">Workplace photos</h2>
        <article className="admin-card mt-4 p-5">
          <ActionForm action={saveExperiencePhotoAction} className="grid gap-3 sm:grid-cols-2">
            <input className="admin-input sm:col-span-2" type="file" name="photo_file" accept="image/*" required />
            <input className="admin-input" name="alt" placeholder="Alt text" />
            <input className="admin-input" name="caption" placeholder="Caption" />
            <input className="admin-input" type="number" name="sort_order" defaultValue={0} />
          </ActionForm>
        </article>
        <div className="mt-4 grid gap-4">
          {experiencePhotos.map((photo) => (
            <article key={photo.id} className="admin-card p-5">
              {photo.image_url ? (
                <div className="relative mb-4 h-24 w-32 overflow-hidden rounded-lg">
                  <Image src={photo.image_url} alt={photo.alt} fill className="object-cover" sizes="128px" />
                </div>
              ) : null}
              <ActionForm action={saveExperiencePhotoAction} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={photo.id} />
                <input type="hidden" name="image_url" value={photo.image_url} />
                <input className="admin-input sm:col-span-2" type="file" name="photo_file" accept="image/*" />
                <input className="admin-input" name="alt" defaultValue={photo.alt} />
                <input className="admin-input" name="caption" defaultValue={photo.caption} />
                <input className="admin-input" type="number" name="sort_order" defaultValue={photo.sort_order} />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="visible" defaultChecked={photo.visible} /> Visible
                </label>
              </ActionForm>
              <ConfirmForm action={deleteExperiencePhotoAction} label="Delete photo">
                <input type="hidden" name="id" value={photo.id} />
                <input type="hidden" name="image_path" value={photo.image_path || ""} />
              </ConfirmForm>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
