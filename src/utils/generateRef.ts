export const generateRef = (): string => {
  const timestamp = Date.now(); // ensures uniqueness over time
  const random = Math.floor(Math.random() * 1_000_000); // extra entropy

  return `GAP-${timestamp}-${random}`;
};
