import type { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
  title?: string;
  size?: number | string;
  spriteHref?: string;
}

export declare const Icon: import('react').MemoExoticComponent<(props: IconProps) => import('react').ReactElement>;
export default Icon;