// import { usePage } from "@inertiajs/react";
// import { PageProps as InertiaPageProps } from "@inertiajs/core";

// interface CustomPageProps extends InertiaPageProps {
//   language: { [key: string]: string };
// }

// export function __(key: string, replace: Record<string, string> = {}): string {
//   const { language } = usePage<CustomPageProps>().props;

//   let translation = language[key] ?? key;
//   // console.log("key " + key);
//   // console.log("language[key] " + language[key]);
  
//   Object.keys(replace).forEach((placeholder) => {
//     translation = translation.replace(`:${placeholder}`, replace[placeholder]);
//   });

//   return translation;
// }

// // src/lib/lang.tsx
// import { usePage } from "@inertiajs/react";
// import { PageProps as InertiaPageProps } from "@inertiajs/core";

// interface CustomPageProps extends InertiaPageProps {
//   language: { [key: string]: string };
// }

// export function useTranslate() {
//   const { language } = usePage<CustomPageProps>().props;

//   return (key: string, replace: Record<string, string> = {}) => {
//     let translation = language[key] ?? key;

//     Object.keys(replace).forEach((placeholder) => {
//       translation = translation.replace(`:${placeholder}`, replace[placeholder]);
//     });

//     return translation;
//   };
// }


// import { usePage } from '@inertiajs/react';
// import translations from '../../lang';
// import { PageProps as InertiaPageProps } from "@inertiajs/core";

// export interface CustomPageProps extends InertiaPageProps {
//   locale: string;
// }

// export function __(key: string, replace: Record<string, string> = {}): string {
//   const { locale } = usePage<CustomPageProps>().props;

//   const lang = translations[locale] || {};

//   let translation = lang[key] ?? key;

//   Object.keys(replace).forEach((placeholder) => {
//     translation = translation.replace(`:${placeholder}`, replace[placeholder]);
//   });

//   return translation;
// }



import { usePage } from '@inertiajs/react';
import translations from '../../lang';
import { PageProps as InertiaPageProps } from "@inertiajs/core";

export interface CustomPageProps extends InertiaPageProps {
  locale: string;
}

export function useLang() {
  const { locale } = usePage<CustomPageProps>().props;

  const lang = translations[locale] || {};

  function __(key: string, replace: Record<string, string> = {}): string {
    let translation = lang[key] ?? key;

    Object.keys(replace).forEach((placeholder) => {
      translation = translation.replace(`:${placeholder}`, replace[placeholder]);
    });

    return translation;
  }

  return { __ };
}

 