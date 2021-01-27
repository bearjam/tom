import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { CSlider, CSliderProps } from '../src';

const meta: Meta = {
  title: 'CSlider',
  component: CSlider,
};

export default meta;

const Template: Story<CSliderProps> = args => {
  const [value, setValue] = useState(50);
  return (
    <div>
      <CSlider value={value} set={v => void setValue(parseInt(v))} {...args} />
      <div>{value}</div>
    </div>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
