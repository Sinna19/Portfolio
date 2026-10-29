import { notFound } from "next/navigation";
import EngineeringLab from "@/components/engineering-lab";
import { labIndex, labSlugs } from "@/lib/lab-routes";
export function generateStaticParams() {
  return labSlugs.map((project) => ({ project }));
}
export default async function LabPage({
  params,
  searchParams,
}: {
  params: Promise<{ project: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { project } = await params;
  const index = labIndex(project);
  if (index < 0) notFound();
  const { view } = await searchParams;
  return (
    <EngineeringLab
      initialTab={index}
      initialExperience={view === "implementation" ? "implementation" : "demo"}
    />
  );
}
