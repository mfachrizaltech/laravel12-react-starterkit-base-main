export function SetDeepValue(obj: any, path: string, value: any) {
  const keys = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.');

  let current = obj;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      if (!(key in current)) {
        current[key] = /^\d+$/.test(keys[index + 1]) ? [] : {};
      }
      current = current[key];
    }
  });
}


export function flattenObject(obj: any, prefix = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc, key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(obj[key])) {
      obj[key].forEach((item, i) => {
        Object.assign(acc, flattenObject(item, `${path}[${i}]`));
      });
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], path));
    } else {
      acc[path] = obj[key];
    }
    return acc;
  }, {} as Record<string, any>);
}


function getFriendlyFieldName(field: string): string {
  return field
    .replace(/\[\d+\]/g, '') // remove array indices like [0]
    .split('.') // handle nested fields like customer.name
    .map(part =>
      part
        .split('_') // convert snake_case to words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
        .join(' ')
    )
    .join(' ');
}

function applyRule(
  field: string,
  value: any,
  rule: string,
  errors: Record<string, any>,
  __: (key: string, replace?: Record<string, string>) => string,
  data: Record<string, any>
) : boolean {
  const [ruleName, param] = rule.split(':');

  if (ruleName === 'required') {
    if (value === undefined || value === null || value.toString().trim() === '') {
      SetDeepValue(errors, field, __('validation.required', { attribute: getFriendlyFieldName(field) }));
      return true;
    }
  }

  // Skip other validations if nullable is in rules and value is null/empty
  if (ruleName.includes('nullable') && (value === undefined || value === null || value === '')) {
    return true;
  }

  if (ruleName === 'numeric') {
    if (value === null || value === undefined || isNaN(Number(value))) {
      SetDeepValue(errors, field, __('validation.numeric', { attribute: getFriendlyFieldName(field) }));
      return true;
    }
  }
  
  if (ruleName === 'array') {
    if (!Array.isArray(value)) {
      SetDeepValue(errors, field, __('validation.array', { attribute: getFriendlyFieldName(field) }));
      return true;
    }
  }

  if (ruleName === 'min') {
    const min = Number(param);
    if (typeof value === 'string' && value.length < min) {
      SetDeepValue(errors, field, __('validation.min.string', { attribute: getFriendlyFieldName(field), min: String(min) }));
      return true;
    } else if (typeof value === 'number' && value < min) {
      SetDeepValue(errors, field, __('validation.min.numeric', { attribute: getFriendlyFieldName(field), min: String(min) }));
      return true;
    } else if (Array.isArray(value) && value.length < min) {
      SetDeepValue(errors, field, __('validation.min.array', { attribute: getFriendlyFieldName(field), min: String(min) }));
      return true;
    }
  }

  if (ruleName === 'same') {
    const compareTo = data[param];
    if (value !== compareTo) {
      SetDeepValue(errors, field, __('validation.same', { attribute: getFriendlyFieldName(field) }));
      return true;
    }
  }

  return false;
}
 
export function ValidateField(
  data: Record<string, any>,
  rules: Record<string, string>,
  __: (key: string, replace?: Record<string, string>) => string
): Record<string, any> {
  const errors: Record<string, any> = {};
  const flattened = flattenObject(data);

  Object.entries(rules).forEach(([ruleKey, ruleString]) => {
    const ruleList = ruleString.split('|');
    const hasWildcard = ruleKey.includes('*');

    if (hasWildcard) {
      // Use flattened object for wildcards
      const pattern = '^' + ruleKey
        .replace(/\./g, '\\.')         // escape dots
        .replace(/\\\.\*/g, '\\[\\d+\\]') // replace `.*` with `[digit]` pattern
        + '$';
      const regex = new RegExp(pattern);

      Object.entries(flattened).forEach(([flatKey, flatValue]) => {
        if (regex.test(flatKey)) { 
          for (const rule of ruleList) {
            const hasError = applyRule(flatKey, flatValue, rule, errors, __, data);
            if (hasError) break;
          }
        }
      });
    } else { 
      const value = data[ruleKey];
      for (const rule of ruleList) {
        const hasError = applyRule(ruleKey, value, rule, errors, __, data);
        if (hasError) break;
      }
    }
  });

  return errors;
}

export function IsRequired(
  field: string,
  rules: Record<string, string>
): boolean {
  const ruleString = rules[field];
  if (!ruleString) return false;

  const ruleList = ruleString.split("|");

  return ruleList.some((rule) => {
    const [ruleName] = rule.split(":");
    return ruleName === "required";
  });
}