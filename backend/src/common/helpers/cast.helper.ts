type ToNumberOptions = {
  default?: number;
  min?: number;
  max?: number;
};

export const toNumber = (value: string, opts: ToNumberOptions = {}) => {
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
};

export const toLowerCase = (value: string) => {
  return value.toLowerCase();
};

export const toUpperCase = (value: string) => {
  return value.toUpperCase();
};
