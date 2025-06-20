import User from "@/backend/models/User";
import { ROLES_EMPLOYEE,STATUS_ACTIVE } from "@/form/user";
import { NextRequest, NextResponse } from 'next/server';
import { Op } from "sequelize";
export async function GET(req: NextRequest) {
    try {
        const aEmployee = await User.findAll({
            where: {
                roleId:{[Op.in]: ROLES_EMPLOYEE},
                status:STATUS_ACTIVE,
            },
           attributes:['id', 'name', 'phone', 'email', 'roleId',],
        })
  
      return NextResponse.json({ message: 'Lấy thông tin người dùng thành công', data:aEmployee }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng' }, { status: 500 });
    }
  }
