import React, { FC, HTMLProps } from 'react';

interface CSliderProps extends HTMLProps<HTMLDivElement> {
  set: (value: string) => void;
}
const CSlider: FC<CSliderProps> = ({
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
          set(e.target.value);
        }}
        value={value}
      />
      <label htmlFor={name}>{name}</label>
      {children}
    </div>
  );
};

export default CSlider;
