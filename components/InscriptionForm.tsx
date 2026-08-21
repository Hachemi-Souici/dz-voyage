"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/PasswordInput";
import { isPasswordValid } from "@/lib/password";

const USERNAME_PATTERN = /^[a-z0-9_-]{3,30}$/i;

export function InscriptionForm() {
  const t = useTranslations("registerForm");
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!USERNAME_PATTERN.test(username)) {
      setErrorMessage(t("usernameInvalid"));
      return;
    }

    if (!isPasswordValid(password)) {
      setErrorMessage(t("passwordWeak", { requirements: t("passwordRequirements") }));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t("passwordMismatch"));
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(
        error.message.includes("already registered") ? t("emailTaken") : t("genericError"),
      );
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="font-utility text-sm uppercase tracking-wide text-nuit">
          {t("usernameLabel")}
        </label>
        <input
          id="username"
          type="text"
          required
          minLength={3}
          maxLength={30}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
        />
        <p className="text-xs text-encre/60">{t("usernameHint")}</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-utility text-sm uppercase tracking-wide text-nuit">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="font-utility text-sm uppercase tracking-wide text-nuit">
          {t("passwordLabel")}
        </label>
        <PasswordInput
          id="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        <p className="text-xs text-encre/60">{t("passwordRequirements")}</p>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="confirmPassword"
          className="font-utility text-sm uppercase tracking-wide text-nuit"
        >
          {t("confirmPasswordLabel")}
        </label>
        <PasswordInput
          id="confirmPassword"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-argile">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded bg-argile px-4 py-2 font-utility text-sm uppercase tracking-wide text-chaux hover:bg-nuit disabled:opacity-60"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
