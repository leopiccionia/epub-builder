export function generateItemId (path: string): string {
  return path.replaceAll(/\W/g, '-')
}
