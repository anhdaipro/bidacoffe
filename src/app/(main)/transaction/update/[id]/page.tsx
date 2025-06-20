'use client';
import React, { useState,useEffect } from 'react';
import {useTransaction } from '@/app/query/useTransaction';
import FormProductTransaction from '@/component/transaction/FormTransaction';
import { useParams } from 'next/navigation';
export default function CreateProductTransaction() {
  const {data:transaction, isLoading} = useTransaction(Number(useParams().id));
  // useEffect(()=>{
  //   setLoading(isLoading)
  // },[isLoading])
  if (isLoading) {
    return(
      <div></div>
    )
  }
  return (
    <FormProductTransaction transaction ={transaction}/>
  );
}
