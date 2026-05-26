export function getAcademicYear(date: Date) {
  const month = date.getMonth() + 1;

  if (month >= 6) {
    return date.getFullYear();
  } else {
    return date.getFullYear() - 1;
  }
}