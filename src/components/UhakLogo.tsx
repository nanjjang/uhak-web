"use client";

export default function UhakLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 40 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Book top */}
      <path
        d="M6 4h28a2 2 0 0 1 0 4H6a2 2 0 0 1 0-4z"
        fill="currentColor"
      />
      {/* Shield body */}
      <path
        d="M6 8h28v18c0 8-6 14-14 14S6 34 6 26V8z"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
      />
      {/* U shape inside */}
      <path
        d="M15 16v8a5 5 0 0 0 10 0v-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Stem */}
      <line x1="20" y1="40" x2="20" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Leaves */}
      <path
        d="M20 46c-3-1-5-3-5-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 46c3-1 5-3 5-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
