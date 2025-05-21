// app/products/create/page.tsx
'use client';
import React, { useState,useRef } from 'react';
import './main.css'
import FormProductPage from '@/app/conponent/product/FormProduct';
import { STATUS_ACTIVE } from '@/form/product';
const CreateProductPage = () => {
  const product = {
    id: null,
    name: "",
    status:STATUS_ACTIVE,
    image: null,
    price: 0,
    categoryId: '',
  };
 

  return (<FormProductPage product={product}/>)
 
};

export default CreateProductPage;
