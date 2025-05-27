'use client';
import React, { useState,useEffect } from 'react';
import FormProductTransaction from '@/app/conponent/transaction/FormTransaction';
export default function CreateProductTransaction() {
  const transaction = {
    type: '',
    totalAmount: 0,
    dateDelivery: '',
    details: [],
  }
  
  return (
    <FormProductTransaction transaction ={transaction}/>
  );
}
