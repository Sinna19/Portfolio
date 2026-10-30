import { ArrowUpRight } from "lucide-react";
import { projectContext } from "@/lib/project-context";

export function DeploymentActions({
  index,
  className,
}: {
  index: number;
  className: string;
}) {
  return projectContext[index].deploymentLinks.map((link) => {
    const label = link.label + (link.loginRequired ? " · Login required" : "");
    return (
      <a
        key={link.url}
        className={className}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in a new tab)`}
      >
        {label} <ArrowUpRight size={14} />
      </a>
    );
  });
}
