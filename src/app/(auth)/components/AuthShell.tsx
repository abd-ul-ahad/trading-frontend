import { AuthBrandPanel } from './AuthBrandPanel';

export function AuthShell({
  variant,
  children,
}: {
  variant: 'sign-in' | 'register';
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <AuthBrandPanel variant={variant} />
      <div className="flex flex-col items-center justify-center bg-background px-6 py-12 sm:px-10 lg:px-10">
        {children}
      </div>
    </div>
  );
}
