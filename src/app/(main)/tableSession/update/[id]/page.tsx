'use client';
import React, { useState,useEffect } from 'react';
import FormTableSession from '@/component/tableSession/Form';
import { useParams } from 'next/navigation';
import { useTableSession } from '@/app/query/useTableSession';
export default function CreateProductTransaction() {
  const {data:tableSession, isLoading} = useTableSession(Number(useParams().id));
  // useEffect(()=>{
  //   setLoading(isLoading)
  // },[isLoading])
  if (isLoading) {
    return(
      <div></div>
    )
  }
  return (
    <FormTableSession tableSession ={tableSession}/>
  );
}
