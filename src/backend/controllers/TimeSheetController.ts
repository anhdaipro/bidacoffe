
import { verifyQrToken } from '../utils/verifyQrToken';
import TimeSheet from '../models/TimeSheet';
import { Request, Response } from 'express';
class TimeSheetController {
    public static async actionCreate(req: Request, res: Response): Promise<void> {
        try {
          const { qrData } = req.body;
          // Xác thực mã QR
          const employeeId = verifyQrToken(qrData);
          if (!employeeId) {
            res.status(400).json({ message: 'Mã QR không hợp lệ' });
          }
    
          const now = new Date();
          const todayStart = new Date(now);
          todayStart.setHours(0, 0, 0, 0);
    
          const todayEnd = new Date(now);
          todayEnd.setHours(23, 59, 59, 999);
    
          // Tìm các bản ghi chấm công hôm nay của nhân viên
          const timeSheetExist = await TimeSheet.findOne({
            where: {
              employeeId,
              checkInTime: {
                gte: todayStart,
                lte: todayEnd,
              },
            },
          });
    
          let type = 'IN';

          if (!timeSheetExist){
            type = 'IN';
          } else if (timeSheetExist) {
            type = 'OUT';
          } else {
            res.status(404).json({
              message: 'Bạn đã chấm công đủ hôm nay',
            });
            return;
          }
          if (timeSheetExist) {
            // Cập nhật thời gian ra cho bản ghi đã tồn tại
            await timeSheetExist.update({
              checkOutTime: now,
            });
          }else{
            await TimeSheet.create({
              data: {
                employeeId,
                checkInTime: now,
              },
            });
          }
          // Tạo bản ghi chấm công mới
          res.status(200).json({ message: `Chấm công ${type === 'IN' ? 'vào' : 'ra'} lúc ${now.toLocaleTimeString()}`,});
        } catch (error) {
          console.error('Lỗi khi chấm công:', error);
          res.status(500).json({ message: 'Đã xảy ra lỗi khi chấm công' });
        }
    }
     // Action: Cập nhật bản ghi chấm công
    public static async actionUpdate(req: Request, res: Response): Promise<void> {
      try {
        const { id } = req.params;
        const { checkInTime, checkOutTime } = req.body;
  
        const timesheet = await TimeSheet.findByPk(id);
  
        if (!timesheet) {
          res.status(404).json({
            message: 'Table session not found',
          });
          return;
        }
  
        await timesheet.update({
          checkInTime,
          checkOutTime,
        });
  
        res.status(200).json({
          message: 'Table session updated successfully',
          data: timesheet,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({
          message: 'Error updating table session',
          error: errorMessage,
        });
      }
  }

  // Action: Xem chi tiết bản ghi chấm công
  public static async actionView(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const timeSheet = await TimeSheet.findByPk(id);
      if (!timeSheet) {
        res.status(404).json({ message: 'Không tìm thấy bản ghi chấm công' });
        return;
      }

      res.status(200).json({ message: 'Lấy thông tin thành công', data: timeSheet });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin bản ghi chấm công:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin bản ghi chấm công' });
    }
  }

  // Action: Lấy danh sách tất cả bản ghi chấm công
  public static async actionIndex(req: Request, res: Response): Promise<void> {
    try {
      const TimeSheets = await TimeSheet.findAll();

      res.status(200).json({ message: 'Lấy danh sách thành công', data: TimeSheets });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bản ghi chấm công:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách bản ghi chấm công' });
    }
  }
}
export default TimeSheetController;


