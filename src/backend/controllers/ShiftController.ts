import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Shift from '../models/Shift';

class ShiftController {
  // Tạo một ca làm việc mới
  public static async createShift(req: Request, res: Response): Promise<void> {
    try {
      const { employeeId, startTime, endTime, shiftType } = req.body;

      const shift = await Shift.create({
        employeeId,
        startTime,
        endTime,
        shiftType,
      });

      res.status(201).json({
        message: 'Shift created successfully',
        data: shift,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        message: 'Error creating shift',
        error: errorMessage,
      });
    }
  }

  // Lấy danh sách tất cả các ca làm việc
  public static async getAllShifts(req: Request, res: Response): Promise<void> {
    try {
      const shifts = await Shift.findAll();

      res.status(200).json({
        message: 'Shifts retrieved successfully',
        data: shifts,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        message: 'Error retrieving shifts',
        error: errorMessage,
      });
    }
  }

  // Lấy thông tin một ca làm việc theo ID
  public static async getShiftById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const shift = await Shift.findByPk(id);

      if (!shift) {
        res.status(404).json({
          message: 'Shift not found',
        });
        return;
      }

      res.status(200).json({
        message: 'Shift retrieved successfully',
        data: shift,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        message: 'Error retrieving shift',
        error: errorMessage,
      });
    }
  }

  // Cập nhật thông tin một ca làm việc
  public static async updateShift(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { employeeId, startTime, endTime, shiftType } = req.body;

      const shift = await Shift.findByPk(id);

      if (!shift) {
        res.status(404).json({
          message: 'Shift not found',
        });
        return;
      }

      await shift.update({
        employeeId,
        startTime,
        endTime,
        shiftType,
      });

      res.status(200).json({
        message: 'Shift updated successfully',
        data: shift,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        message: 'Error updating shift',
        error: errorMessage,
      });
    }
  }

  // Xóa một ca làm việc
  public static async deleteShift(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const shift = await Shift.findByPk(id);

      if (!shift) {
        res.status(404).json({
          message: 'Shift not found',
        });
        return;
      }

      await shift.destroy();

      res.status(200).json({
        message: 'Shift deleted successfully',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        message: 'Error deleting shift',
        error: errorMessage,
      });
    }
  }

  // Tính lương hàng tháng cho nhân viên
  public static async calculateMonthlySalary(req: Request, res: Response): Promise<void> {
    try {
      const { employeeId, month, year, salaryPerShift } = req.body;

      // Tính ngày đầu tiên và ngày cuối cùng của tháng
      const startDate = new Date(year, month - 1, 1); // Ngày đầu tiên của tháng
      const endDate = new Date(year, month, 0); // Ngày cuối cùng của tháng

      // Đếm số ca làm việc của nhân viên trong tháng
      const shifts = await Shift.count({
        where: {
          employeeId,
          startTime: {
            [Op.between]: [startDate, endDate], // Lọc theo tháng
          },
        },
      });

      // Tính tổng lương
      const totalSalary = shifts * salaryPerShift;

      res.status(200).json({
        message: 'Monthly salary calculated successfully',
        data: {
          employeeId,
          month,
          year,
          totalSalary,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        message: 'Error calculating monthly salary',
        error: errorMessage,
      });
    }
  }
  public static async calculateMonthlySalaryForAll(req: Request, res: Response): Promise<void> {
    try {
      const { month, year, salaryPerShift } = req.body;

      // Tính ngày đầu tiên và ngày cuối cùng của tháng
      const startDate = new Date(year, month - 1, 1); // Ngày đầu tiên của tháng
      const endDate = new Date(year, month, 0); // Ngày cuối cùng của tháng

      // Lấy danh sách tất cả các nhân viên có ca làm việc trong tháng
      const shifts = await Shift.findAll({
        where: {
          startTime: {
            [Op.between]: [startDate, endDate], // Lọc theo tháng
          },
        },
        attributes: ['employeeId'], // Chỉ lấy employeeId
        group: ['employeeId'], // Nhóm theo employeeId
      });

      // Tính lương cho từng nhân viên
      // const salaries = await Promise.all(
      //   shifts.map(async (shift) => {
      //     const employeeId = shift.employeeId;

      //     // Gọi phương thức calculateMonthlySalary từ model
      //     const totalSalary = await Shift.calculateMonthlySalary(employeeId, startDate, endDate, salaryPerShift);

      //     return {
      //       employeeId,
      //       totalSalary,
      //     };
      //   })
      // );

      res.status(200).json({
        message: 'Monthly salaries calculated successfully',
        // data: salaries,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        message: 'Error calculating monthly salaries',
        error: errorMessage,
      });
    }
  }
}

export default ShiftController;