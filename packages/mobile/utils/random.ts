export const lfsr = (seed: number) => {
  // Example polynomial: x^16 + x^14 + x^13 + x^11 + 1 (feedback taps)
  const tap = 0b1011010000000000; // Taps for the LFSR
  let lfsrState = seed; // Initialize the LFSR state

  return function () {
    // Calculate feedback bit
    let bit = 0;
    for (let i = 0; i < 16; i++) {
      // Check if the current tap is set
      if ((tap & (1 << i)) !== 0) {
        bit ^= (lfsrState >> i) & 1; // XOR the bit at the tapped position
      }
    }

    // Shift the state and insert the feedback bit
    lfsrState = (lfsrState >> 1) | (bit << 15); // Shift right and set feedback bit at MSB

    // Normalize to [0, 1)
    return (lfsrState >>> 0) / 0xffff; // Ensure unsigned and normalize
  };
};
