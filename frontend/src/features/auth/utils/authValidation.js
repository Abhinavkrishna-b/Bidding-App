
export function validateSignIn(values) {
  const errors = {};

  const email = values.email.trim();

  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function validateSignUp(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();

  if (name.length < 2 || name.length > 100) {
    errors.name = "Name must contain 2–100 characters.";
  }

  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (values.password.length < 8 || values.password.length > 128) {
    errors.password = "Password must contain 8–128 characters.";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}
