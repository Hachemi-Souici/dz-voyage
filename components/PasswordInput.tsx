"use client";

import { useState, type ChangeEvent } from "react";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  minLength?: number;
  required?: boolean;
};

/** Champ mot de passe avec bouton afficher/masquer (icône œil). */
export function PasswordInput({ id, value, onChange, autoComplete, minLength, required }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <div className="relative">
      <input
        id={id}
        type={isVisible ? "text" : "password"}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={handleChange}
        className="w-full rounded border border-nuit/30 bg-white px-3 py-2 pr-10 text-encre"
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={isVisible}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-nuit/50 hover:text-nuit"
      >
        {isVisible ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <path
              d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.5A9.9 9.9 0 0 1 12 5c5 0 9 4.5 10 7-.5 1.2-1.4 2.6-2.6 3.8M6.6 6.6C4.5 8 3 10 2 12c1 2.5 5 7 10 7 1.4 0 2.7-.3 3.9-.9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <path
              d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
      </button>
    </div>
  );
}
