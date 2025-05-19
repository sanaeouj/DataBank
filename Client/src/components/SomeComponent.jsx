import { useEffect, useState } from 'react';

const SomeComponent = () => {
  const [data, setData] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;  
  useEffect(() => {
    fetch(`${backendUrl}/api/some-endpoint`)  
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, [backendUrl]);

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>  
      ))}
    </div>
  );
};

export default SomeComponent;