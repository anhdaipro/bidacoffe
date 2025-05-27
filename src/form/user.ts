export const STATUS_ACTIVE = 1
export const STATUS_INACTIVE = 0
export const ROLE_ADMIN = 1;
export const ROLE_EMPLOYEE = 2;
export const ROLE_CUSTOMER = 3;
export const ROLE_MANAGE = 4;
export const STATUS_LABELS: Record<number, string> = {
  [STATUS_ACTIVE]: 'Hoạt động',
  [STATUS_INACTIVE]: 'Không hoạt động',
}

export const ROLE_LABELS: Record<number, string> = {
  [ROLE_ADMIN]: 'Quản trị viên',
  [ROLE_EMPLOYEE]: 'Nhân viên',
  [ROLE_CUSTOMER]: 'Khách hàng',
  [ROLE_MANAGE]: 'Giám sát',
};