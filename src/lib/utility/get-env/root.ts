export function getEnv(key: string) {
  const env = process.env[key];
  if (!env) throw new Error(`Environtmenr variable <${key}> is not set!`);
  return env;
}
