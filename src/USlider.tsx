import React, {
  HTMLProps,
  forwardRef,
  MutableRefObject,
  useRef,
  ChangeEvent,
} from 'react';

interface USliderProps extends HTMLProps<HTMLDivElement> {
  name: string;
  set: (value: string) => void;
}
const USlider = forwardRef<HTMLInputElement, USliderProps>(
  (
    {
      name,
      id = name,
      min = 0,
      max = 100,
      step = 1,
      set,
      defaultValue = 50,
      ...otherProps
    },
    ref
  ) => {
    const animationFrame: MutableRefObject<number | null> = useRef<number>(
      null
    );

    function changeHandler(event: ChangeEvent<HTMLInputElement>) {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
      event.persist();
      animationFrame.current = requestAnimationFrame(() => {
        set(event.target.value);
      });
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
      </div>
    );
  }
);
export default USlider;
