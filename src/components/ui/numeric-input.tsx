import React, { useEffect, useRef } from 'react'

import AutoNumeric from 'autonumeric'

import { cn } from '../../lib/utils'
import { Input } from './input'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  setAmount: (amount: number) => void
  initialAmount?: number
  placeholder?: string
  prefixClassName?: string
  className?: string
  inputClassName?: string
  isBalanceMax?: boolean
  hideDollarSign?: boolean
  decimalPlaces?: number
}

export const MoneyInput: React.FC<Props> = ({
  setAmount,
  initialAmount,
  placeholder,
  className,
  inputClassName,
  prefixClassName,
  isBalanceMax,
  hideDollarSign,
  decimalPlaces = 2,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const autoNumericRef = useRef<AutoNumeric | null>(null)

  useEffect(() => {
    if (inputRef.current) {
      const minimumValue = '0.00'
      const maximumValue = '99999999999999.99'

      autoNumericRef.current = new AutoNumeric(inputRef.current, {
        digitGroupSeparator: ',',
        decimalCharacter: '.',
        currencySymbol: '',
        minimumValue,
        decimalPlaces,
        maximumValue,
        modifyValueOnWheel: false,
        formatOnPageLoad: true,
        unformatOnSubmit: true,
        watchExternalChanges: true,
        emptyInputBehavior: 'focus',
        overrideMinMaxLimits: 'invalid',
        allowDecimalPadding: false,
      })

      // Add event listener for value changes
      inputRef.current.addEventListener('autoNumeric:formatted', () => {
        const value = autoNumericRef.current?.getNumber() || 0
        setAmount(value)
      })
    }

    return () => {
      if (autoNumericRef.current) {
        autoNumericRef.current.remove()
      }
    }
  }, [setAmount, isBalanceMax, decimalPlaces])

  return (
    <div
      className={cn(
        'border-2 border-border rounded-md bg-card flex flex-row items-center focus-within:border-secondary transition-colors duration-200 h-fit overflow-hidden pr-1',
        className
      )}
    >
      <div
        className={cn(
          'size-12 text-lg opacity-60 aspect-square h-full flex items-center justify-center bg-foreground/10',
          prefixClassName,
          hideDollarSign && 'hidden'
        )}
      >
        $
      </div>
      <Input
        {...props}
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={cn(
          'w-full bg-card border-none text-xl h-fit py-0 px-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 focus:border-none placeholder:text-muted-foreground/40',
          inputClassName
        )}
        defaultValue={initialAmount?.toString()}
      />
    </div>
  )
}
