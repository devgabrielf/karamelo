type ToNumberOptions = {
  default?: number;
  min?: number;
  max?: number;
};

export function toNumber(value: string, opts: ToNumberOptions = {}) {
  let newValue: number = Number.parseInt(value || String(opts.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }

    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }

  return newValue;
}

export function toLowerCase(value: string) {
  return value.toLowerCase();
}

export function toUpperCase(value: string) {
  return value.toUpperCase();
}
