export const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
};
export const normalizeString = (str: string) => {
  return str
    .normalize('NFD') // Chuẩn hóa chuỗi thành dạng Unicode tổ hợp
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .toLowerCase(); // Chuyển thành chữ thường
};
export function formatDate(dateStr:string) {
  const date = new Date(dateStr);

  // Định dạng lại ngày theo kiểu "d/m/y h:i"
  return `${date.getDate().toString().padStart(2, '0')}/${
    (date.getMonth() + 1).toString().padStart(2, '0')}/${
    date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${
    date.getMinutes().toString().padStart(2, '0')}`;
}
export const calHourPlay = (playedMinutes: number) => {
  const hours = Math.floor(playedMinutes / 60);
  const mins = playedMinutes - hours * 60;
  return `${hours} giờ ${mins} phút`;
};
interface PropUpload{
  secure_url: string;
  public_id:string;
}
export const uploadImageToCloudinary = async (file: File, folder:string): Promise<PropUpload> =>{
  const cloudName = "dltj2mkhl";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "upload");
  formData.append("folder", folder); // 👈 đây là folder đích
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  return data; // link ảnh
}