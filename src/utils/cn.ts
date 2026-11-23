// Склеює класи Tailwind, відкидаючи falsy-значення: cn('px-2', isActive && 'bg-primary-600')
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
