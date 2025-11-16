export const imageStates = ["loading", "default", "hover"] as const;
export type ImageStates = (typeof imageStates)[number];
