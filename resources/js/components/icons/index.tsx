import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const AudioIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.4166 4.00001C21.4166 3.77689 21.3173 3.56536 21.1456 3.42287C20.9739 3.28039 20.7477 3.22173 20.5284 3.26285L8.52841 5.51285C8.17368 5.57936 7.91663 5.88909 7.91663 6.25001V9.98484C7.91644 9.99437 7.91644 10.0039 7.91663 10.0135V14.4585C7.3716 14.1636 6.72327 14 6.04163 14C5.16738 14 4.34794 14.2691 3.73094 14.7392C3.11333 15.2098 2.66663 15.9138 2.66663 16.75C2.66663 17.5862 3.11333 18.2902 3.73094 18.7608C4.34794 19.2309 5.16738 19.5 6.04163 19.5C6.91587 19.5 7.73532 19.2309 8.35231 18.7608C8.95774 18.2995 9.39893 17.6139 9.41611 16.7993C9.41645 16.79 9.41663 16.7806 9.41663 16.7712V16.75V10.62L19.9166 8.60938V12.2085C19.3716 11.9136 18.7233 11.75 18.0416 11.75C17.1674 11.75 16.3479 12.0191 15.7309 12.4892C15.1133 12.9598 14.6666 13.6638 14.6666 14.5C14.6666 15.3362 15.1133 16.0402 15.7309 16.5108C16.3479 16.9809 17.1674 17.25 18.0416 17.25C18.9159 17.25 19.7353 16.9809 20.3523 16.5108C20.9577 16.0495 21.3989 15.3639 21.4161 14.5493C21.4165 14.54 21.4166 14.5306 21.4166 14.5212V14.5V4.00001ZM19.9166 14.5C19.9166 14.2316 19.7757 13.9357 19.4432 13.6824C19.1102 13.4286 18.6171 13.25 18.0416 13.25C17.4661 13.25 16.9731 13.4286 16.64 13.6824C16.3076 13.9357 16.1666 14.2316 16.1666 14.5C16.1666 14.7684 16.3076 15.0643 16.64 15.3176C16.9731 15.5714 17.4661 15.75 18.0416 15.75C18.6171 15.75 19.1102 15.5714 19.4432 15.3176C19.7757 15.0643 19.9166 14.7684 19.9166 14.5ZM7.44325 15.9324C7.7757 16.1857 7.91663 16.4816 7.91663 16.75C7.91663 17.0184 7.7757 17.3143 7.44325 17.5676C7.11018 17.8214 6.61713 18 6.04163 18C5.46613 18 4.97307 17.8214 4.64 17.5676C4.30755 17.3143 4.16663 17.0184 4.16663 16.75C4.16663 16.4816 4.30755 16.1857 4.64 15.9324C4.97307 15.6786 5.46613 15.5 6.04163 15.5C6.61713 15.5 7.11018 15.6786 7.44325 15.9324ZM19.9166 7.08212V4.9037L9.41663 6.87245V9.09276L19.9166 7.08212Z"
      fill="currentColor"
    />
  </svg>
);

export const LayoutDashboardIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z"
      fill="currentColor"
    />
  </svg>
);

export const SquareUserRoundIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
      fill="currentColor"
    />
  </svg>
);

export const VideoIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z"
      fill="currentColor"
    />
  </svg>
);

export const CalendarClockIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
      fill="currentColor"
    />
  </svg>
);

export const CircleHelpIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z"
      fill="currentColor"
    />
  </svg>
);

export const CreditCardIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"
      fill="currentColor"
    />
  </svg>
);

export const SettingIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.67 19.18 11.36 19.14 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 6.03 15.35 5.84 14.79 5.71L14.4 3.06C14.36 2.82 14.16 2.64 13.92 2.6H10.08C9.84 2.64 9.65 2.82 9.61 3.06L9.22 5.71C8.66 5.84 8.12 6.03 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.31 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.88 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.86 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 17.97 8.65 18.16 9.21 18.29L9.6 20.94C9.65 21.18 9.84 21.36 10.08 21.4H13.92C14.16 21.36 14.36 21.18 14.39 20.94L14.78 18.29C15.34 18.16 15.88 17.97 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.69 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.64 21.15 14.5L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z"
      fill="currentColor"
    />
  </svg>
);

export const HorizontaLDots: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
      fill="currentColor"
    />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z"
      fill="currentColor"
    />
  </svg>
);
