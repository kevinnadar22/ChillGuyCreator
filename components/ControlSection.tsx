interface ControlSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ControlSection({ title, children }: ControlSectionProps) {
  return (
    <div className="mb-6">
      {children}
    </div>
  );
} 