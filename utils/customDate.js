const DAYS = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
];

const getWeekDay = (date) => {
  return DAYS[new Date(date * 1000).getDay()];
};

export { getWeekDay };
