export const getEnvMode = () => process.env.NODE_ENV;
export const isTestMode = () => process.env.NODE_ENV === 'test' && !window.SKIP_TEST_MODE;
export const isProductionMode = () => process.env.NODE_ENV === 'production';
export const isDevMode = () => !isTestMode() && !isProductionMode();
