import { DataTypes, Model, ValidationError,ValidationErrorItem} from 'sequelize';
import sequelize from '../database/db';
import fs from 'fs';
import path from 'path';
import BaseModel from './Base';
import User from './User';
import { ROLE_ADMIN, SENCOND_DAY } from '../BidaConst';
import redisClient from '../redisClient';
import { CATEGORY, CATEGORY_ORDER, LSTATUS ,STATUS_ACTIVE} from '@form/product';
import ProductTransactionDetail from './ProductTransactionDetail';
import { Op,fn,col,literal } from 'sequelize';
import { IMPORT,EXPORT } from '@form/transaction';
import cloudinary from '../utils/cloudinary';
import dayjs from 'dayjs';
class Product extends Model {
  public id!: number;
  public name!: string;//tên
  public price!: number;//giá
  public image!: string;//hình ảnh 
  public categoryId!:number;//loại
  public status!:number;
  public uidLogin!: number;
  public canUpdate!:boolean;
  public canDelete!: boolean;
  public inventory!:number;
  public public_image!:string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public errors!: string[];
  public modelOld?: Product;
  public rUidLogin?: User;
  public validateCreate(){
    if(this.price <=0){
      this.errors.push('Price must be greater than 0.');
    }
  }
  public validateUpdate(){
    const errors: ValidationErrorItem[] = [];
  }
  public fnCanUpdate(user:User){
    if(user.id == this.uidLogin || user.roleId == ROLE_ADMIN){
      this.canUpdate = true;
    }else{
      this.canUpdate = false;
    }
    
  }
  public fnCanDelete(user:User){
    if(user.roleId == ROLE_ADMIN){
      this.canDelete = true;
    }else{
      this.canDelete = false;
    }
  }
  public fnCanUpdateStatus(user:User){
    if(user.roleId == ROLE_ADMIN){
      this.canDelete = true;
    }else{
      this.canDelete = false;
    }
  }
  public async getAllProduct(){
    const cacheKey = 'products:search'
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return parsedData;
    }
    const products = await Product.findAll({where:{status: STATUS_ACTIVE}});
    // Lưu kết quả vào cache
    await redisClient.set(cacheKey, JSON.stringify(products), 'EX', SENCOND_DAY); // Cache trong 1 giờ
    return products;
  }
  public async deleteCache(){
    const keys = await redisClient.keys('products:*');
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  }
  public async getInventory(getAll = false){
    const conHaving = getAll ? 0 : 1;
    const aProductTransactionDetail = await ProductTransactionDetail.findAll({
      attributes: [
          'productId',
          [
              literal(`
                SUM(CASE WHEN type = ${IMPORT} THEN quantity ELSE 0 END) -
                SUM(CASE WHEN type = ${EXPORT} THEN quantity ELSE 0 END)
              `),
              'quantity',
          ],
      ],
      group: ['productId'],
      order: [[literal('quantity'), 'DESC']],
      having:{quantity: {[Op.gte]: conHaving} }
    });
  
    const products =  await Product.findAll({
        where:{
            categoryId: {[Op.in] : CATEGORY_ORDER},
            status: STATUS_ACTIVE,
        }
    })
    const productInventory = aProductTransactionDetail.map((mProductTransactionDetail:ProductTransactionDetail) =>{
        const product = products.find(item => item.id == mProductTransactionDetail.productId)
        return {quantity:mProductTransactionDetail.quantity*1,...product?.toJSON()}
    })
    return productInventory
  }
  public async deleteImage() {
    try {
      if(!this.modelOld || !this.modelOld.public_image || this.modelOld.public_image == this.public_image){
        return;
      }
      const publicId = this.modelOld.public_image;
      console.log(publicId)
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw error;
    }
  }
  public async getAllProducts({
    page = 1,
    limit = 20,
    name,
    status,
    dateFrom,
    dateTo,
    categoryId,
  }: {
    page?: number;
    limit?: number;
    name?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    categoryId?: string | number;
    
  }) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;
    const cacheKey = `products:${pageNumber}:${limitNumber}:${name || ''}:${categoryId || ''}:${status || ''}:${dateFrom || ''}:${dateTo || ''}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);
    if(!this.rUidLogin){
      return []
    }
    const user = this.rUidLogin
    const where: any = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (dateFrom || dateTo) {
      where.createdAt = {
        ...(dateFrom && { [Op.gte]: dateFrom }),
        ...(dateTo && { [Op.lte]: dayjs(dateTo as string,).add(1) }),
      };
    }
  
    const { rows, count } = await Product.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
      include: [{ model: User, as: 'rUidLogin', attributes: ['name'] }],
      distinct: true,
    });
  
    const mapped = rows.map((p) => {
      p.fnCanDelete(user);
      p.fnCanUpdate(user);
      return {
        ...p.toJSON(),
        canDelete: p.canDelete,
        canUpdate: p.canUpdate,
      };
    });
  
    const data = {
      data: mapped,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
      },
    };
  
    await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);
    return data;
  }
}

Product.init(
  {
    id: {//id
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {//tên
      type: DataTypes.STRING,
      allowNull: false,
    },
    public_image: {//tên
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {//giá
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uidLogin: {//người đăng nhập
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {//status
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue:STATUS_ACTIVE,
      validate: {
        // Kiểm tra nếu giá trị status phải là một trong những giá trị hợp lệ
        isIn: {
          args: [LSTATUS],
          msg: 'Trạng thái phải là một trong các giá trị hợp lệ: ACTIVE hoặc INACTIVE',
        },
      },
    },
    categoryId:{//loại
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
          // Kiểm tra nếu giá trị status phải là một trong những giá trị hợp lệ
          isIn: {
            args: [CATEGORY],
            msg: 'Vui lòng chọn hợp lệ',
          },
        },
    },
    image: {
    type: DataTypes.STRING, // Kiểu chuỗi để lưu URL hoặc đường dẫn ảnh
    allowNull: true, // Cho phép để trống
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    underscored: true,
  },
);
Product.belongsTo(User,{
  foreignKey:'uidLogin',
  as:'rUidLogin'
})
Product.beforeDestroy(async (product: Product) => {
  if (product.image) {
    // Xây dựng đường dẫn đầy đủ đến file ảnh
    const uploadDir = path.resolve(__dirname, '../../'); // Quay lại 2 bậc từ backend/models/ tới uploads/
    const imagePath = path.join(uploadDir, product.image); // product.image chứa tên file ảnh
    try {
      // Xóa file ảnh
      await fs.promises.unlink(imagePath);
      console.log(`Image deleted: ${imagePath}`);
    } catch (err: any) {
      // Nếu lỗi không phải là "file không tồn tại", log lỗi
      if (err.code !== 'ENOENT') {
        console.error('Error deleting image:', err);
      } else {
        console.warn(`Image not found: ${imagePath}`);
      }
    }
  }
});
export default Product;