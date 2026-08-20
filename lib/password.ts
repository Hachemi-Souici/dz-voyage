export const PASSWORD_REQUIREMENTS =
  "8 caractères minimum, avec au moins une majuscule, une minuscule et un chiffre.";

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function isPasswordValid(password: string): boolean {
  return PASSWORD_PATTERN.test(password);
}
