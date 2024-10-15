import * as bcrypt from 'bcrypt';

const saltRounds = 10;

// Function to generate a hash from a password
export const getHash = (data: string): string => {
  if (data.length == 0) throw new Error('Password should not be empty');
  const hash = bcrypt.hashSync(data, saltRounds);
  return hash;
};

// Function to compare a password with its hash
export const compareHash = (data: string, hash: string): boolean => {
  return bcrypt.compareSync(data, hash);
};
