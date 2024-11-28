
export function convertDuration(duration: string): string {
  const seconds = parseInt(duration.replace('s', ''));
  const minutes = seconds / 60;
  const hours = minutes / 60;

  if (hours >= 1) {
    return `${Math.floor(hours)}h ${Math.round((hours - Math.floor(hours)) * 60)} min`;
  } else {
    return `${Math.round(minutes)} min`;
  }
}
