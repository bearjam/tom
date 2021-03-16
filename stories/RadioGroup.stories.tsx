import { Meta, Story } from "@storybook/react"
import React, { useState } from "react"
import { RadioGroup, RadioGroupProps } from "../src/inputs"

const meta: Meta = {
  title: "RadioGroup",
  component: RadioGroup,
}

export default meta

const Template: Story<RadioGroupProps> = args => {
  const [value, setValue] = useState("foo")
  return <RadioGroup value={value} setValue={setValue} {...args} />
}

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({})

Default.args = {
  name: "hiyor",
  items: [
    {
      label: "Foo!",
      value: "foo",
    },
    {
      label: "Bar!",
      value: "bar",
    },
  ],
}
