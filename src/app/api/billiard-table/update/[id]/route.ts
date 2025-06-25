import { NextRequest, NextResponse } from 'next/server';
import BilliardTable from '@/backend/models/BilliardTable';
import LogUpdate from '@/backend/models/LogUpdate';
import { TYPE_TABLE } from '@/backend/models/LogUpdate';
import { ChangeLog } from '@/types/Model';
import { authenticateJWT } from '@/midleware';


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const param = await params
    const body = await req.json()
    const table = await BilliardTable.findByPk(param.id);
    if (!table) {
      return NextResponse.json({ message: 'Không tìm thấy bàn billiard' }, { status: 404 });
    }
    const user = await authenticateJWT()
    if (user instanceof NextResponse) return user;
    const uidLogin = user.id
    const updates = body;
    const changes:ChangeLog = {};
    const json = table.toJSON()
    for (const key in updates) {
      if (json[key] != updates[key]) {
        changes[key] = {
          old: json[key],
          new: updates[key],
        };
      }
    }

    await table.update(updates);

    if (Object.keys(changes).length > 0) {
      await LogUpdate.create({
        userId: uidLogin,
        belongId: table.id,
        type: TYPE_TABLE,
        roleId: user.roleId,
        changes,
      });
    }

    return NextResponse.json({ message: 'Product updated successfully', data: table }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Lỗi khi cập nhật bàn billiard' }, { status: 500 });
  }
}