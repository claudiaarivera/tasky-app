export const isValidDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) return true;
  return false;
};
