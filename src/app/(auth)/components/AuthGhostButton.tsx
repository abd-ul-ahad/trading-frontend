export function AuthGhostButton({
  children,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="font-outfit mb-2 w-full cursor-pointer rounded-[9px] border border-border bg-transparent px-3 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/25 hover:text-foreground"
    >
      {children}
    </button>
  );
}
