export function AuthSubmitButton({
  children,
  disabled,
  loading,
  type = 'submit',
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: 'submit' | 'button';
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="font-outfit mb-4 w-full cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-primary-300 to-primary px-3 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-[opacity,transform] hover:opacity-90 hover:-translate-y-px active:translate-y-0 disabled:cursor-default disabled:opacity-45 disabled:transform-none"
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}
