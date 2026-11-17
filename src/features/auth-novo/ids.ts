import type { Method } from "./ui";

export const tabId = (prefix: string, m: Method) => `${prefix}-tab-${m}`;
export const panelId = (prefix: string, m: Method) => `${prefix}-panel-${m}`;
