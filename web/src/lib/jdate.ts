import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

export function formatJ(date: Date | string | number, fmt = "YYYY/MM/DD HH:mm") {
  return dayjs(date).calendar("jalali").locale("fa").format(fmt);
}
