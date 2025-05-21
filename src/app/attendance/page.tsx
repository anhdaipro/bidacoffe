'use client';

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';
export default function AttendancePage() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
        'reader', // ID của div nơi hiển thị scanner
        {
          fps: 10, // Số lần quét mỗi giây
          qrbox: { width: 250, height: 250 }, // Kích thước vùng quét
        },
        false // Không hiển thị nút "Clear"
      );
      scanner.render(
        async (decodedText, decodedResult) => {
            console.log('QR Code detected:', decodedText);
            setMessage('Đang gửi dữ liệu...');
            const res = await fetch('/api/attendance/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrData: decodedResult }),
            });

            const data = await res.json();
            setMessage(data.message || 'Chấm công thành công');
            scanner.clear();
        },
        (error) => {
          console.warn('QR Code scan error:', error);
        }
    );
    
    return () => {
        scanner.clear(); // Dọn dẹp scanner khi component bị unmount
      };
  }, []);

  return (
    <main className="text-center p-4">
      <h1 className="text-2xl mb-4">Chấm công bằng QR</h1>
      <div id="reader" style={{ width: '500px' }} />
      <p className="mt-4 text-green-600">{message}</p>
    </main>
  );
}
