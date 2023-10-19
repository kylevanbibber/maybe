import React, { useState, useEffect } from 'react';

function DataDisplay() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    fetch('http://localhost:5000/testdb')
      .then(response => response.json())
      .then(data => setData(data.results))
      .catch(error => console.error('Error fetching data:', error));
  }, []);  // Empty dependency array ensures this runs once when component mounts

  return (
    <div>
      <h1>Data from DB</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.your_column_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DataDisplay;
