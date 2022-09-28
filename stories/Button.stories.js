import { createButton } from './Button';

// More on default export: https://storybook.js.org/docs/html/writing-stories/introduction#default-export
export default {
  title: 'WeatherApp/Button',
  // More on argTypes: https://storybook.js.org/docs/html/api/argtypes
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'tetriary'],
      control: { type: 'radio' },
    },
    label: { control: 'text' },
    onClick: { action: 'onClick' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    isOutline: { control: 'boolean' },
  },
};

// More on component templates: https://storybook.js.org/docs/html/writing-stories/introduction#using-args
const Template = ({ label, ...args }) => {
  // You can either use a function to create DOM elements or use a plain html string!
  // return `<div>${label}</div>`;
  return createButton({ label, ...args });
};


export const Main = Template.bind({});
export const Outline = Template.bind({});


Main.args = {
  primary: true,
  isOutline: false,
  label: 'Button',
};

Outline.args = {
  isOutline: true,
  label: 'Button',
};
