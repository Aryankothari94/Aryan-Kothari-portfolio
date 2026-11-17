import { Container, SectionHeading } from '../components/ui';
import { ProjectCard } from '../components/projects/ProjectCard';
import { projects } from '../data/content';

export default function WorkPage() {
  return (
    <main className="relative z-10 min-h-screen pt-28 pb-28">
      <Container className="space-y-12">
        <SectionHeading
          index="02"
          eyebrow="Selected Work"
          title="All"
          accent="Projects"
          subtitle="Production platforms, client deliveries, and active AI systems from my portfolio."
        />

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </Container>
    </main>
  );
}

