// file: generatePdf.ts
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
pdfMake.vfs = pdfFonts.vfs;
// Bắt buộc: cấu hình font cho pdfmake
const thinBorderLayout = {
  hLineWidth: (i: number, node: any) => 0.5,
  vLineWidth: (i: number, node: any) => 0.5,
  hLineColor: (i: number, node: any) => 'black',
  vLineColor: (i: number, node: any) => 'black',
  paddingLeft: (i: number, node: any) => 4,
  paddingRight: (i: number, node: any) => 4,
};
const generatePdf = () => {
  const docDefinition:TDocumentDefinitions = {
    content: [
      { text: 'Hóa đơn bán hàng', style: 'title' },
      { text: 'Khách hàng: Nguyễn Văn A', margin: [0, 10, 0, 5] },
      { text: 'Ngày: 30/05/2025', margin: [0, 0, 0, 10] },

      {
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            ['Sản phẩm', 'Số lượng', 'Giá'],
            ['Áo thun', '2', '100.000đ'],
            ['Quần jean', '1', '200.000đ'],
            ['Tổng cộng', '', { text: '400.000đ', bold: true }],
          ],
        },
        layout: thinBorderLayout // có border đầy đủ
      },

      {
        text: 'Cảm ơn quý khách!',
        alignment: 'center',
        margin: [0, 30, 0, 0],
        style: 'thank'
      }
    ],
    styles: {
      title: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      thank: {
        fontSize: 14,
        italics: true,
        color: 'gray'
      }
    },
    defaultStyle: {
      fontSize: 12
    }
  };
 
  pdfMake.createPdf(docDefinition).open();  // mở preview
};
export default generatePdf;