// import * as LucideIcons from 'lucide-react';
// import type { LucideIcon } from 'lucide-react';

// // export function GetLucideIcon(name: string) {
// //     const IconComponent = (LucideIcons as unknown as Record<string, React.FC<any>>)[name];
// //     return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
// // }; 

// export function GetLucideIcon(name: string): LucideIcon | null {
//   const IconComponent = (LucideIcons as Record<string, LucideIcon>)[name];
//   return IconComponent ?? null;
// }


import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function GetLucideIcon(name: string): LucideIcon | null {
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return IconComponent ?? null;
}
