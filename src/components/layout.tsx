type LayoutProps = {
  header: React.ReactNode;
  actions: React.ReactNode;
  output: React.ReactNode;
  footer: React.ReactNode;
};

export default function Layout({
  header,
  actions,
  output,
  footer,
}: LayoutProps) {
  return (
    <div className="relative flex h-screen w-full flex-col gap-4 bg-background p-4">
      <header className="h-12 w-full flex-none rounded border bg-background">
        {header}
      </header>
      <main className="flex min-h-[300px] flex-1 gap-4">
        <div className="flex-1 rounded border bg-background md:max-w-md">
          {actions}
        </div>
        <div className="hidden flex-1 rounded border bg-background md:block">
          {output}
        </div>
      </main>
      <footer className="sticky bottom-0 h-12 w-full flex-none rounded border bg-background">
        {footer}
      </footer>
    </div>
  );
}
