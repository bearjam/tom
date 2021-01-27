import React, { FC, forwardRef, HTMLProps, useState } from "react"
import { paramCase } from "change-case"

export const RadioInput = forwardRef<
  HTMLInputElement,
  HTMLProps<HTMLInputElement>
>((props, ref) => {
  return <input type="radio" ref={ref} {...props} />
})

interface RadioFieldProps
  extends Omit<HTMLProps<HTMLInputElement>, "name" | "value" | "label"> {
  name: string
  value: string
  label: string
}

export const RadioField = forwardRef<HTMLInputElement, RadioFieldProps>(
  ({ className, label, name, value, children, ...props }, ref) => {
    const id = paramCase(`${name}--${value}`)
    return (
      <div className={className}>
        <div>
          <RadioInput id={id} name={name} value={value} {...props} ref={ref} />
        </div>
        <label htmlFor={id}>{label}</label>
        {children}
      </div>
    )
  }
)

export interface RadioGroupProps extends HTMLProps<HTMLDivElement> {
  items: {
    label: string
    value: string
  }[]
  defaultValue: string
  name: string
}

export const RadioGroup: FC<RadioGroupProps> = ({
  items,
  name,
  defaultValue,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue)
  return (
    <div {...props}>
      {items.map(itemProps => (
        <RadioField
          key={`${name}--${itemProps.value}`}
          name={name}
          checked={value === itemProps.value}
          onChange={e =>
            e.currentTarget.checked ? setValue(itemProps.value) : null
          }
          {...itemProps}
        />
      ))}
    </div>
  )
}
