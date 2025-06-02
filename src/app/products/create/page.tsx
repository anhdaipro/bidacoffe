// app/products/create/page.tsx
'use client';
import React from 'react';
import './main.css'
import FormProductPage from '@/app/conponent/product/FormProduct';
import { STATUS_ACTIVE } from '@/form/product';
const CreateProductPage = () => {
  const product = {
    id:0,
    name: "",
    status:STATUS_ACTIVE,
    image: '',
    price: 0,
    categoryId: 0,
  };
 

  return (<FormProductPage product={product}/>)
 
};

export default CreateProductPage;
