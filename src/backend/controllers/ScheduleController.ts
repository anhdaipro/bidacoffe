import { Request, Response } from 'express';
import Schedule from '../models/Schedule';
import User from '../models/User';
import Shift from '../models/Shift';
import { Op } from 'sequelize';
import dayjs from 'dayjs';

class ScheduleController {
  // Tạo nhiều bản ghi lịch làm việc
  public static async createSchedules(req: Request, res: Response): Promise<void> {
    try {
      const {schedules, workDate} = req.body.schedules; // Mảng các bản ghi lịch làm việc

      if (!Array.isArray(schedules) || schedules.length === 0) {
        res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
        return;
      }
      const schedulesWithDefaults = schedules.map((schedule:any) => {
        return {
          ...schedule,
          workDate,
        };
      })
      const createdSchedules = await Schedule.bulkCreate(schedulesWithDefaults);
      
      res.status(201).json({
        message: 'Tạo lịch làm việc thành công.',
        data: createdSchedules,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi tạo lịch làm việc.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Lấy danh sách lịch làm việc
  public static async getAllSchedules(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      const whereClause: any = {};
      if (startDate && endDate) {
        whereClause.workDate = {
          [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
        };
      }

      const schedules = await Schedule.findAll({
        where: whereClause,
        include: [User, Shift], // Bao gồm thông tin nhân viên và ca làm việc
      });

      res.status(200).json({
        message: 'Lấy danh sách lịch làm việc thành công.',
        data: schedules,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi lấy danh sách lịch làm việc.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Cập nhật nhiều bản ghi lịch làm việc
  public static async updateSchedules(req: Request, res: Response): Promise<void> {
    try {
      const schedules = req.body.schedules; // Mảng các bản ghi cần cập nhật

      if (!Array.isArray(schedules) || schedules.length === 0) {
        res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
        return;
      }

      const updatedSchedules = [];
      for (const schedule of schedules) {
        const existingSchedule = await Schedule.findByPk(schedule.id);
        if (existingSchedule) {
          await existingSchedule.update(schedule);
          updatedSchedules.push(existingSchedule);
        }
      }

      res.status(200).json({
        message: 'Cập nhật lịch làm việc thành công.',
        data: updatedSchedules,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi cập nhật lịch làm việc.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Xóa lịch làm việc
  public static async deleteSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const schedule = await Schedule.findByPk(id);
      if (!schedule) {
        res.status(404).json({ message: 'Không tìm thấy lịch làm việc.' });
        return;
      }

      await schedule.destroy();

      res.status(200).json({
        message: 'Xóa lịch làm việc thành công.',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi xóa lịch làm việc.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Check-in
  public static async checkIn(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const schedule = await Schedule.findByPk(id);
      if (!schedule) {
        res.status(404).json({ message: 'Không tìm thấy lịch làm việc.' });
        return;
      }

      if (schedule.checkIn) {
        res.status(400).json({ message: 'Nhân viên đã check-in.' });
        return;
      }

      schedule.checkIn = new Date();
      await schedule.save();

      res.status(200).json({
        message: 'Check-in thành công.',
        data: schedule,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi check-in.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Check-out
  public static async checkOut(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const schedule = await Schedule.findByPk(id);
      if (!schedule) {
        res.status(404).json({ message: 'Không tìm thấy lịch làm việc.' });
        return;
      }

      if (!schedule.checkIn) {
        res.status(400).json({ message: 'Nhân viên chưa check-in.' });
        return;
      }

      if (schedule.checkOut) {
        res.status(400).json({ message: 'Nhân viên đã check-out.' });
        return;
      }

      schedule.checkOut = new Date();
      await schedule.save();

      res.status(200).json({
        message: 'Check-out thành công.',
        data: schedule,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi check-out.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default ScheduleController;