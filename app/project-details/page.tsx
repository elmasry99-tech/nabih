import ProjectDetails from '@/components/ProjectDetails';

export const metadata = {
  title: 'Project Details | Nabeeh NILM',
  description: 'Technical overview and engineering details of the Nabeeh intelligent energy monitor.',
};

export default function ProjectDetailsPage() {
  return (
    <main className="min-h-screen pt-4">
      {/* Decorative background for the standalone page ... */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% -20%, rgba(34, 211, 238, 0.08) 0%, transparent 70%)',
        }}
      />
      
      <div className="container mx-auto">
        <ProjectDetails />
      </div>
    </main>
  );
}
