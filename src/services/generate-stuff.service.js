
export const generateRandomNumber = (from,to) => Math.floor(Math.random( ) *(to - from)) + from;

export const getRGBA = (colour, a = 1) => `rgba(${colour},${colour},${colour},${a})`;
