import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

const controlClass =
  'block w-full min-h-10 rounded-md border bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted/70 ' +
  'aria-[invalid=true]:border-danger';

interface FieldShellProps {
  label: string;
  error?: string;
  hint?: string;
  htmlFor: string;
  children: ReactNode;
}

function FieldShell({ label, error, hint, htmlFor, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextFieldProps extends ComponentProps<'input'> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, error, hint, className, ...props }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} error={error} hint={hint} htmlFor={id}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, error ? 'border-danger' : 'border-line', className)}
        {...props}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps extends ComponentProps<'textarea'> {
  label: string;
  error?: string;
}

export function TextAreaField({ label, error, className, ...props }: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} error={error} htmlFor={id}>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, 'resize-y', error ? 'border-danger' : 'border-line', className)}
        {...props}
      />
    </FieldShell>
  );
}

interface SelectFieldProps extends ComponentProps<'select'> {
  label: string;
  error?: string;
}

export function SelectField({ label, error, className, children, ...props }: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} error={error} htmlFor={id}>
      <select
        id={id}
        aria-invalid={!!error}
        className={cn(controlClass, error ? 'border-danger' : 'border-line', className)}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}
