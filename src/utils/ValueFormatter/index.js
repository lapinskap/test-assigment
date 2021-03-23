export default function ValueFormatter(formatter, value) {
  let parsed;
  if (typeof formatter === 'string') {
    switch (formatter) {
      case 'number':
        return +value;
      case 'integer':
        return parseInt(value.replace(/\D/g, ''), 10);
      case 'float':
        return value.replace(/[^.\d]/g, '');
      case 'only_digits':
        return value.replace(/\D/g, '');
      case 'ipv4':
        return value.replace(/[^0-9.]/g, '');
      case 'post_code':
        parsed = value.replace(/[^0-9-]/g, '');
        if (parsed.length === 3 && !parsed.includes('-')) {
          parsed = `${parsed.substr(0, 2)}-${parsed.substr(2, 3)}`;
        }
        return parsed.substr(0, 6);
      default:
        return value;
    }
  } else if (typeof formatter === 'function') {
    return formatter(value);
  }
  return value;
}
