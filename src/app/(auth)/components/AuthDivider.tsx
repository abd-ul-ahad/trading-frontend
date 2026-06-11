export function AuthDivider({ text }: { text: string }) {
  return (
    <div className="mb-3.5 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="font-outfit whitespace-nowrap text-[13px] text-muted-foreground">
        {text}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
