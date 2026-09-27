import type { InputHTMLAttributes, ReactNode } from "react";
export function FormField({
  label,
  error,
  aside,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="form-field">
      <div className="field-label">
        <label htmlFor={id}>{label}</label>
        {aside}
      </div>
      <input
        {...props}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p className="error-message" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
