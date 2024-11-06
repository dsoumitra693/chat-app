export const xorshift32 = (seed: number) => {
  let state = seed || 1; // Ensure a non-zero seed

  return function () {
    // Xorshift algorithm
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;

    // Normalize to [0, 1)
    return (state >>> 0) / 0xffffffff; // Normalize to [0, 1)
  };
};
