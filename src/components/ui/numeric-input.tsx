import { forwardRef, useEffect, useRef, useImperativeHandle, useState } from 'react'
import AutoNumeric from 'autonumeric'
import { cn } from '../../lib/utils'

export interface NumericInputProps {
  value: number
  onChange: (value: number) => void
  className?: string
  decimalPlaces?: number
  minimumValue?: number
  maximumValue?: number
  placeholder?: string
}

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ 
    value, 
    onChange, 
    className, 
    decimalPlaces = 2, 
    minimumValue = 0, 
    maximumValue = 999999999,
    placeholder 
  }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const autoNumericRef = useRef<AutoNumeric | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    useImperativeHandle(ref, () => inputRef.current!)

    useEffect(() => {
      if (inputRef.current && !autoNumericRef.current) {
        try {
          const handleChangeCallback = (value: number) => {
            console.log('AutoNumeric callback triggered:', value)
            onChange(value || 0)
          }

          autoNumericRef.current = new AutoNumeric(inputRef.current, {
            digitGroupSeparator: ",",
            decimalCharacter: ".",
            decimalPlaces,
            currencySymbol: "",
            minimumValue,
            maximumValue,
            modifyValueOnWheel: false,
            formatOnPageLoad: false,
            unformatOnSubmit: true,
            watchExternalChanges: false,
            emptyInputBehavior: "null",
            overrideMinMaxLimits: "ceiling",
            allowDecimalPadding: false,
            decimalCharacterAlternative: ".",
            saveValueToSessionStorage: false,
            selectOnFocus: false,
            caretPositionOnFocus: "end",
            noEventListeners: false,
            readOnly: false,
            wheelOn: "focus",
            // Use AutoNumeric's built-in callbacks
            callBackEntered: () => {
              console.log('AutoNumeric callBackEntered')
              const val = autoNumericRef.current?.getNumber() || 0
              handleChangeCallback(val)
            },
            callBackEdited: () => {
              console.log('AutoNumeric callBackEdited')
              const val = autoNumericRef.current?.getNumber() || 0
              handleChangeCallback(val)
            }
          })

          // Set initial value without triggering events
          if (value > 0) {
            autoNumericRef.current.set(value, { triggerEvent: false })
          }

          const handleChange = () => {
            if (autoNumericRef.current) {
              try {
                const numericValue = autoNumericRef.current.getNumber()
                console.log('NumericInput onChange triggered:', numericValue)
                onChange(numericValue || 0)
              } catch (e) {
                console.warn('AutoNumeric parsing error:', e)
              }
            }
          }

          // Add event listeners directly without timeout
          const inputElement = autoNumericRef.current.node()
          
          // Test basic input event first
          const testHandler = (e: Event) => {
            console.log('Basic input event fired:', e.type)
            // Try to get value directly from input element as backup
            const target = e.target as HTMLInputElement
            if (target && target.value) {
              const rawValue = target.value.replace(/[^0-9.]/g, '') // Remove formatting
              const numValue = parseFloat(rawValue) || 0
              console.log('Direct input value:', rawValue, '-> parsed:', numValue)
              onChange(numValue)
            }
          }
          
          // Listen to multiple events for real-time updates
          inputElement.addEventListener('input', testHandler)
          inputElement.addEventListener('input', handleChange)
          inputElement.addEventListener('keyup', handleChange)
          inputElement.addEventListener('change', handleChange)
          inputElement.addEventListener('autoNumeric:formatted', handleChange)
          inputElement.addEventListener('blur', handleChange)
          
          console.log('AutoNumeric initialized with event listeners')
          setIsInitialized(true)

        } catch (error) {
          console.error('AutoNumeric initialization error:', error)
        }
      }

      return () => {
        if (autoNumericRef.current) {
          try {
            autoNumericRef.current.remove()
          } catch (e) {
            // Ignore cleanup errors
          }
          autoNumericRef.current = null
        }
        setIsInitialized(false)
      }
    }, [])

    // Handle external value changes
    useEffect(() => {
      if (autoNumericRef.current && isInitialized) {
        try {
          const currentValue = autoNumericRef.current.getNumber()
          if (Math.abs(currentValue - value) > 0.001) { // Avoid precision issues
            autoNumericRef.current.set(value, { triggerEvent: false })
          }
        } catch (e) {
          // Ignore setting errors
        }
      }
    }, [value, isInitialized])

    return (
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      />
    )
  }
)

NumericInput.displayName = "NumericInput"