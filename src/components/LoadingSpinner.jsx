import { Loader } from '@mantine/core';
import React from 'react'
import { SpinnerDotted } from 'spinners-react';
import usePrimaryColor from '../hooks/usePrimaryColor';
function LoadingSpinner({size = 25}) {
  const bgPrimary = usePrimaryColor();
  const color = bgPrimary.split("-")[1]
  return (
    <div className=' p-6 '>
    <Loader color={color || 'blue'} size={size} />
    </div>
  )
}

export default LoadingSpinner