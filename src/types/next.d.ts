// src/types/next.d.ts
import { User } from '@/backend/models/User';
import Product from '@/backend/models/Product';

declare module 'next' {
  interface NextApiRequest {
    user?: User;
    controllerName?: string;
    actionName?: string;
    product?: Product;
  }
}
