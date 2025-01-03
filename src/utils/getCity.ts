export const getCity = (): string => {
  const city = process.argv[2];

  if (!city) {
    console.error('Please provide a city name as an argument');
    console.error('Example: "npm start Kyiv" or "npm run dev Kyiv"');
    process.exit(1);
  }

  return city;
};
