import React, {
  HTMLProps,
  forwardRef,
  MutableRefObject,
  useRef,
  ChangeEvent,
  FC,
} from "react"

export interface USliderProps extends HTMLProps<HTMLDivElement> {
  name: string
  set: (value: string) => void
}

export const USlider = forwardRef<HTMLInputElement, USliderProps>(
  (
    {
      name,
      id = name,
      min = 0,
      max = 100,
      step = 1,
      set,
      defaultValue = 50,
      children,
      ...otherProps
    },
    ref
  ) => {
    const animationFrame: MutableRefObject<number | null> = useRef<number>(null)

    function changeHandler(event: ChangeEvent<HTMLInputElement>) {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current)
      }
      event.persist()
      animationFrame.current = requestAnimationFrame(() => {
        set(event.target.value)
      })
    }

    return (
      <div {...otherProps}>
        <input
          type="range"
          name={name}
          id={id}
          min={min}
          max={max}
          step={step}
          onChange={changeHandler}
          defaultValue={defaultValue}
          ref={ref}
        />
        <label htmlFor={name}>{name}</label>
        {children}
      </div>
    )
  }
)

export interface CSliderProps extends HTMLProps<HTMLDivElement> {
  set: (value: string) => void
}

export const CSlider: FC<CSliderProps> = ({
  name,
  id = name,
  min = 0,
  max = 100,
  step = 1,
  set,
  value = 50,
  children,
  ...otherProps
}) => {
  return (
    <div {...otherProps}>
      <input
        type="range"
        name={name}
        id={id}
        min={min}
        max={max}
        step={step}
        onChange={e => {
          set(e.target.value)
        }}
        value={value}
      />
      <label htmlFor={name}>{name}</label>
      {children}
    </div>
  )
}
