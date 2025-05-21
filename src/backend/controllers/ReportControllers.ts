import { Request, Response } from 'express';
import TableSession from '../models/TableSession'; // Import model TableSession
import BilliardTable from '../models/BilliardTable'; // Import model BilliardTable
import { Op,fn,col,literal } from 'sequelize';
import TableOrderDetail from '../models/TableOrder';
import ProductTransactionDetail from '../models/ProductTransactionDetail';
import { EXPORT, IMPORT } from '@form/transaction';
import { STATUS_WAIT_PAID,STATUS_PAID } from '@form/billiardTable';
import Product from '../models/Product';
import { CATEGORY_ORDER, STATUS_ACTIVE } from '@form/product';

class ReportController {
  // Action: Báo cáo doanh thu
  // Action: Báo cáo doanh thu
    public static async reportRevenue(req: Request, res: Response): Promise<void> {
        try {
        const { startDate, endDate } = req.query;
        // Kiểm tra ngày bắt đầu và kết thúc
        if (!startDate || !endDate) {
            res.status(400).json({ message: 'startDate và endDate là bắt buộc.' });
            return;
        }

        // Tính tổng doanh thu từ TableSession
        const revenueData = await TableSession.findOne({
            attributes: [
            [fn('SUM', col('totalAmount')), 'totalRevenue'], // Tính tổng tiền
            [fn('SUM', col('totalAmount')), 'totalRevenue'], // Tính tổng tiền
            ],
            where: {
                createdAt: {
                    [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
                },
                status: STATUS_PAID, // Chỉ tính doanh thu từ các phiên đã hoàn thành
            },
        });

        // Trả về kết quả
        res.status(200).json({
            message: 'Báo cáo doanh thu thành công.',
            data: revenueData,
        });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ message: 'Lỗi khi tạo báo cáo doanh thu.', error: errorMessage });
        }
    }
    public static async revenueByDay(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;
            // Kiểm tra ngày bắt đầu và kết thúc
            if (!startDate || !endDate) {
                res.status(400).json({ message: 'startDate và endDate là bắt buộc.' });
                return;
            }

            // Tính tổng doanh thu từ TableSession
            const revenueData = await TableSession.findAll({
                attributes: [
                    [fn('DATE', col('createdAt')), 'date'], // Ngày
                    [fn('SUM', col('totalAmount')), 'totalRevenue'], // Tính tổng tiền
                ],
                where: {
                    createdAt: {
                        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
                    },
                    status: STATUS_PAID, // Chỉ tính doanh thu từ các phiên đã hoàn thành
                },
                group: ['date'], // Nhóm theo ngày
                order: [['date', 'ASC']], // Sắp xếp theo ngày tăng dần
            });

            // Trả về kết quả
            res.status(200).json({
                message: 'Báo cáo doanh thu thành công.',
                data: revenueData,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ message: 'Lỗi khi tạo báo cáo doanh thu.', error: errorMessage });
        }
    }
    public static async tableUsageTime(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;
    
            if (!startDate || !endDate) {
                res.status(400).json({ message: 'startDate và endDate là bắt buộc.' });
                return;
            }
    
            const usageTime = await TableSession.findOne({
                attributes: [
                    [fn('SUM', fn('TIMESTAMPDIFF', literal('HOUR'), col('startTime'), col('endTime'))), 'totalUsageTime'],
                ],
                where: {
                    createdAt: {
                        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
                    },
                    status:{ [Op.in] : [STATUS_PAID,STATUS_WAIT_PAID]},
                },
            });
    
            res.status(200).json({
                message: 'Thời gian sử dụng bàn bida thành công.',
                data: {
                    totalUsageTime: usageTime?.get('totalUsageTime') || 0,
                },
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ message: 'Lỗi khi tạo báo cáo thời gian sử dụng bàn bida.', error: errorMessage });
        }
    }
    public static async employeePerformance(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;
    
            if (!startDate || !endDate) {
                res.status(400).json({ message: 'startDate và endDate là bắt buộc.' });
                return;
            }
    
            const performance = await TableSession.findAll({
                attributes: [
                    'employeeId',
                    [fn('SUM', col('totalAmount')), 'totalRevenue'],
                ],
                where: {
                    createdAt: {
                        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
                    },
                    status: STATUS_PAID,
                },
                group: ['employeeId'],
                order: [[fn('SUM', col('totalAmount')), 'DESC']],
            });
    
            res.status(200).json({
                message: 'Hiệu suất nhân viên thành công.',
                data: performance,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ message: 'Lỗi khi tạo báo cáo hiệu suất nhân viên.', error: errorMessage });
        }
    }
    public static async bestSellingProduct(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;
    
            if (!startDate || !endDate) {
                res.status(400).json({ message: 'startDate và endDate là bắt buộc.' });
                return;
            }
    
            const bestSellingProduct = await TableOrderDetail.findAll({
                attributes: [
                    'productId',
                    [fn('SUM', col('quantity')), 'totalSold'],
                ],
                where: {
                    createdAt: {
                        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
                    },
                },
                group: ['productId'],
                order: [[fn('SUM', col('quantity')), 'DESC']],
            });
    
            res.status(200).json({
                message: 'Sản phẩm bán chạy nhất thành công.',
                data: bestSellingProduct,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ message: 'Lỗi khi tạo báo cáo sản phẩm bán chạy nhất.', error: errorMessage });
        }
    }
    public static async reportExport(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;
    
            if (!startDate || !endDate) {
                res.status(400).json({ message: 'startDate và endDate là bắt buộc.' });
                return;
            }
    
            const data = await ProductTransactionDetail.findAll({
                attributes: [
                    'productId',
                    [fn('SUM', col('total_price')), 'total'],
                    [fn('SUM', col('quantity')), 'quantity'],
                    
                ],
                where: {
                    createdAt: {
                        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
                    },
                    type:EXPORT
                },
                group: ['productId'],
                // order: [[fn('SUM', col('quantity')), 'DESC']],
            });
            console.log(data)
            const formattedData = data.map((item) => {
                const itemJson = item.toJSON()
                return {
                    productId: itemJson.productId,
                    quantity: itemJson.quantity*1, // Chuyển sang số nguyên
                    total: itemJson.total*1, // Chuyển sang số thực
                }
            })
            res.status(200).json({
                message: 'Báo cáo xuất bán.',
                data: formattedData,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ message: 'Lỗi khi tạo báo cáo sản phẩm bán chạy nhất.', error: errorMessage });
        }
    }
    public static async inventory(req: Request, res: Response): Promise<void> {
        try {
            
            const data = await (new Product).getInventory(false)

            res.status(200).json({
                message: 'Tồn kho',
                data: data,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ message: 'Lỗi khi tạo báo cáo sản phẩm bán chạy nhất.', error: errorMessage });
        }
    }
}

export default ReportController;