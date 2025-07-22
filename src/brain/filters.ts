export type Filter = (text: string) => string;

/**
 * List of filters applied to every outgoing message.
 */
export const filters: Filter[] = [
  text => text.trim()
];

export default filters;
