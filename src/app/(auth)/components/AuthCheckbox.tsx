export function AuthCheckbox({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="mb-6 flex cursor-pointer items-start gap-2.5"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border-[1.5px] border-border bg-card checked:border-primary checked:bg-primary checked:bg-[image:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27none%27 stroke=%27%23000%27 stroke-width=%272%27 d=%27M2 6l3 3 5-6%27/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat"
      />
      <span className="font-outfit text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline">
        {label}
      </span>
    </label>
  );
}
