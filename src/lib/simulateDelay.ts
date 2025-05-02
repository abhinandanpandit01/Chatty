export const simulateDelay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

export const PageLoader = async () => {
  await simulateDelay(1000); // simulate 1 second delay
  return null;
};
