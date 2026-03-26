export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <p className="text-muted-foreground">Project {params.id} — coming soon</p>
    </div>
  );
}
