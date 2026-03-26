export default function ProjectReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <p className="text-muted-foreground">Report for project {params.id} — coming soon</p>
    </div>
  );
}
