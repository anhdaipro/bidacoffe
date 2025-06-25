
import { NextRequest, NextResponse } from 'next/server';
import User from '@/backend/models/User';
import { Op } from 'sequelize';
import {ROLES_EMPLOYEE } from '@/form/user';

export async function GET(req: NextRequest) {
        try {
            const { searchParams } = new URL(req.url);
            const name = searchParams.get('name') || ''
            
            if (!name) {
                return NextResponse.json({ message: 'Vui lòng cung cấp tên để tìm kiếm' },{status:400})
            }
            const user = new User()
            user.name = name
            user.aRoleId = ROLES_EMPLOYEE
            const employees = await user.getUserByName()
            const aData = employees.map((item:User)=>{
                return {id:item.id, name:item.name, label: `${item.name} - ${item.phone}`}
            })
            return NextResponse.json(aData,{status:200})
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Đã xảy ra lỗi khi lấy danh sách người dùng' }, { status: 500 });
        }
    }