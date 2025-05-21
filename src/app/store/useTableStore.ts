import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Table } from '../type/model/Table';
import { TableSession } from '../type/model/TableSession';

type MenuItem = { id: number; name: string; price: number };
type CartItem = MenuItem & { quantity: number };

type TableState = {
  selectedTable: Table | null;
  selectedSession: TableSession | null
  cart: CartItem[];
  startTime: number | null;
  tables: Table[];  // Thêm state để lưu danh sách bàn
  selectTable: (table: Table) => void;
  closePopup: () => void;
  addToCart: (item: MenuItem) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  setTables: (tables: Table[]) => void; // Hàm để cập nhật danh sách bàn
  tableSessions:TableSession[];
  setTableSession: (tableSessions:TableSession[]) => void;
  selectSession: (table: TableSession| null) => void;
};

export const useTableStore = create<TableState>()(
  persist(
    (set) => ({
      selectedTable: null,
      selectedSession: null,
      cart: [],
      startTime: null,
      tables: [],  // Khởi tạo danh sách bàn rỗng
      tableSessions:[],
      selectTable: (table) => set({ selectedTable: table, startTime: Date.now() }),
      closePopup: () => set({ selectedTable: null }),
      addToCart: (item) =>
        set((state) => {
          const exists = state.cart.find((i) => i.id === item.id);
          if (exists) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          } else {
            return { cart: [...state.cart, { ...item, quantity: 1 }] };
          }
        }),
      increaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),
      decreaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart
            .map((i) =>
              i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0),
      })),
      setTables: (tables) => set({ tables }), // Hàm để lưu danh sách bàn
      setTableSession: (tableSessions) => set({ tableSessions }), // Hàm để lưu danh sách bàn
      selectSession: (selectedSession) => set({ selectedSession }),
    }),
    {
      name: 'bida-cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
