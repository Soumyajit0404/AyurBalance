import type { SVGProps } from "react"

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        d="M168 208a80 80 0 0 1-122.5-98.5A80 80 0 0 1 168 48a32 32 0 0 1-28.8 40h-22.4a32 32 0 0 0-31.4 35.1 32.1 32.1 0 0 0 9.7 20.3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M88 208a80 80 0 0 0 122.5-98.5A80 80 0 0 0 88 48a32 32 0 0 0 28.8 40h22.4a32 32 0 0 1 31.4 35.1 32.1 32.1 0 0 1-9.7 20.3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
}
