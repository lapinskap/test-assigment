import { isTestMode } from '../../config/env';

export default function hashInputId(id, testMode = isTestMode()) {
  if (!testMode) {
    return `${id}_${Math.random()}`;
  }
  return id;
}
