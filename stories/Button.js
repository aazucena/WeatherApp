import './button.css';
import { contrastColor } from 'contrast-color';

export const createButton = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  onClick,
  ...params
}) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerText = label;
  btn.addEventListener('click', onClick);

  const mode = params?.isOutline ? 'weatherapp-button--outline' : 'weatherapp-button--main';
  btn.className = ['weatherapp-button', `weatherapp-button--${size}`, mode].join(' ');

  switch(true) {
    case (params?.isOutline === true):
      btn.style.backgroundColor = contrastColor({ bgColor: backgroundColor });
      btn.style.border = `1px solid ${backgroundColor}`;
      btn.style.color = backgroundColor;
      break
    default:
      btn.style.backgroundColor = backgroundColor;
      btn.style.color = contrastColor({ bgColor: backgroundColor });
      break;
  }

  return btn;
};
