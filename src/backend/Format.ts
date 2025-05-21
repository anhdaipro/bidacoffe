export const convertDate = (date: string) => {
    const [day, month, year] = date.split('-').map(Number); // Tách ngày, tháng, năm
    return new Date(year, month - 1, day); // Tạo đối tượng Date (tháng bắt đầu từ 0)
};
export const convertDateFormat = (date: string) => {
const [day, month, year] = date.split('/'); // Tách ngày, tháng, năm
    return new Date(`${year}-${month}-${day}`); // Kết hợp lại theo định dạng yyyy-MM-dd
};
export const convertToSlashFormat = (date: string, format = '/') => {
    const [year, month, day] = date.split('-'); // Tách năm, tháng, ngày
    return `${day}${format}${month}${format}${year}`; // Kết hợp lại theo định dạng dd/MM/yyyy
};
export const convertDateTimeToSlashFormat = (dateTime: string,format = '/') => {
    const [date, time] = dateTime.split(' '); // Tách phần ngày và giờ
    const [year, month, day] = date.split('-'); // Tách năm, tháng, ngày
    const [hour, minute] = time.split(':'); // Tách giờ và phút
    return `${day}${format}${month}${format}${year} ${hour}:${minute}`; // Kết hợp lại theo định dạng dd/MM/yyyy HH:mm
};
export const addDay = (dateStr: string | Date, num: number): Date => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + num);
    return date;
  };