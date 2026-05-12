import { createElement, memo } from 'react';

const DEFAULT_SPRITE_HREF = '/design-system/icons/lucide.svg';

function normalizeIconName(name) {
  return name.startsWith('icon-') ? name : `icon-${name}`;
}

export const Icon = memo(function Icon({
  name,
  title,
  size = 20,
  spriteHref = DEFAULT_SPRITE_HREF,
  className = 'hub-icon',
  ...props
}) {
  const symbolId = normalizeIconName(name);
  const ariaProps = title
    ? { role: 'img', 'aria-label': title }
    : { 'aria-hidden': 'true' };

  return createElement(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      className,
      ...ariaProps,
      ...props,
    },
    title ? createElement('title', null, title) : null,
    createElement('use', { href: `${spriteHref}#${symbolId}` }),
  );
});

export default Icon;