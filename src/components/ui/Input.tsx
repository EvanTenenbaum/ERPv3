'use client'
import React, { InputHTMLAttributes, useState } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  onValidate?: (value: string) => string | undefined
}

export function Input({ error, onValidate, onBlur, onChange, ...rest }: Props) {
  const [msg, setMsg] = useState<string | undefined>(error)

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (onValidate) setMsg(onValidate(e.target.value))
    onBlur?.(e)
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (msg) setMsg(undefined)
    onChange?.(e)
  }

  const invalid = !!msg
  const props: any = { ...rest }
  if (!props.inputMode && (props.type === 'number' || props.inputMode === undefined)) props.inputMode = 'decimal'
  return (
    <input
      {...props}
      aria-invalid={invalid}
      className={[
        'block w-full rounded-md border px-3 py-2 text-sm',
        invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
      ].join(' ')}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  )
}
