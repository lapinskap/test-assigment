import { useEffect, useState } from 'react';

const useCities = (asOptions = false) => {
  const [result, setResult] = useState([]);
  useEffect(() => {
    fetch('/data/cities.json')
      .then((res) => res.json())
      .then((res) => {
        let cities = res;
        if (asOptions) {
          cities = res.map((city) => ({ value: city, label: city }));
        }
        setResult(cities);
      })
      .catch((e) => console.error(e));
  }, [asOptions]);

  return result;
};

export default useCities;
