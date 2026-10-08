const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function p(path: string) {
  return `${BASE_PATH}${path}`;
}
