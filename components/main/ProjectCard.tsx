import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { fetchProjectData } from "@/context/fetchProjectData";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProjectPage() {
  const projectData = await fetchProjectData(
    "w3b3d3v",
    8,
    process.env.GITHUB_TOKEN
  );

  const nodes = projectData.data.organization.projectV2.items.nodes;

  return (
    <div className="max-w-2/3 sm:1/3">
      <Card className="flex flex-col gap-2 p-4 bg-slate-200">
        {projectData ? (
          <>
            {nodes.slice(0, 7).map((node: any, index: number) => (
              <Card
                className="flex flex-row items-center justify-between gap-4 p-2 w-full"
                key={node.id}
              >
                <div className="flex items-center gap-4">
                  <Checkbox />
                  <Badge className="bg-slate-800 text-primary-foreground p-2">
                    #{index + 1}
                  </Badge>
                  <p className="w-full">{node.content.title}</p>
                </div>
                <Button className="bg-slate-400 text-primary-foreground">
                  🔼️ Votar
                </Button>
              </Card>
            ))}
            {nodes.length > 7 && (
              <Button className="mt-2 bg-slate-400">Ver mais...</Button>
            )}
          </>
        ) : (
          <Skeleton className="w-full h-12" />
        )}
      </Card>
    </div>
  );
}
