export const required = description => value =>
  !value || value.trim() === '' ? description : undefined;

export const match = (re, description) => value =>
  !value.match(re) ? description : undefined;
export const list = (...validators) => value =>
  validators.reduce(
    (result, validator) => result || validator(value),
    undefined
  );
export const hasError = (valiationErrors, fieldName) =>
  valiationErrors[fieldName] !== undefined;

export const validateMany = (validators, fields) =>
  Object.entries(fields).reduce(
    (result, [name, value]) => ({
      ...result,
      [name]: validators[name](value)
    }),
    {}
  );

export const anyErrors = errors =>
  Object.values(errors).some(error => error !== undefined);
