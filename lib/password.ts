// Le texte des exigences est traduit — voir messages/*.json
// (registerForm.passwordRequirements).
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function isPasswordValid(password: string): boolean {
  return PASSWORD_PATTERN.test(password);
}
