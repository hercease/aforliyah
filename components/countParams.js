import { useSearchParams } from 'next/navigation';

const CountArrivalParams = () => {
  const searchParams = useSearchParams();
  let arrivalCount = 0;

  // Loop through all search parameters
  searchParams.forEach((value, key) => {
    if (key.startsWith('arrival')) {
      arrivalCount++;
    }
  });

  return arrivalCount;
};

export default CountArrivalParams;
