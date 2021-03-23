import configuration from '../.appConfig.json';

class AppConfiguration {
  constructor(config) {
    this.configuration = config;
    this.cache = new Map();
  }

  get(path) {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }
    const parts = path.split('.');
    let valueHolder = null;
    if (parts.length) {
      valueHolder = this.configuration;
    }
    for (let i = 0; i < parts.length; i += 1) {
      valueHolder = valueHolder[parts[i]];
      if (valueHolder === undefined) {
        break;
      }
    }
    const result = resolveValue(valueHolder);
    this.cache.set(path, result);
    return result;
  }
}

const resolveValue = (configValue) => {
  const envValueSyntax = configValue?.match(/%env\(([A-Z_]+)\)%/);
  if (!envValueSyntax) {
    return configValue;
  }
  const envValueKey = envValueSyntax[1];
  return process.env[envValueKey];
};

const appConfig = new AppConfiguration(configuration);

export default appConfig;
