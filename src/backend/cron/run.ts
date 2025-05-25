import JobDay from "./jobs/JobDay";
import cron from 'node-cron';
cron.schedule(
    '0 23 * * *',
    async () => {
      const job = new JobDay();
      await job.run();
    },
    {
      timezone: 'Asia/Ho_Chi_Minh', // 🇻🇳 Giờ Việt Nam
    }
  );