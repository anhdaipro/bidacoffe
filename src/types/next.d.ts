// src/types/next.d.ts
import { User } from '@/models/User';
import Product from '@/models/Product';

declare module 'next' {
  interface NextApiRequest {
    user?: User;
    controllerName?: string;
    actionName?: string;
    product?: Product;
  }
}
