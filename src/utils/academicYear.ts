export const getAcademicYear = (
  date: Date
) => {

  const year =
    date.getFullYear();

  const month =
    date.getMonth();

  // June = 5
  if (month >= 5) {

    return `${year}-${year + 1}`;
  }

  return `${year - 1}-${year}`;
};