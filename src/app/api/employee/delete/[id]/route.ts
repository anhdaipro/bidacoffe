import { NextRequest, NextResponse } from 'next/server';

import User from '@/backend/models/User';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const employee = await User.findByPk(param.id);
    if (!employee) {
      return NextResponse.json({ message: 'Không tìm thấy nhân viên' }, { status: 404 });
    }
    await employee.destroy();
    return NextResponse.json({ message: 'Xóa nhân viên thành công' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Lỗi khi xóa nhân viên' }, { status: 500 });
  }
}