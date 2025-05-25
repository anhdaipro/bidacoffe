// cron/jobs/MidnightJob.ts
import Schedule from '@/backend/models/Schedule';
import JobBase from './JobBase';
import dayjs from 'dayjs';
export default class JobDay extends JobBase {
  async run(): Promise<void> {
    const mSchedule = new Schedule
    mSchedule.calculateSalary
  }
  private async generateWeeklySchedule(): Promise<void> {
    // logic tạo lịch làm việc mới cho tuần tiếp theo
  }
}