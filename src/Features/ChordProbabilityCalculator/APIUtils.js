const authenticateHooktheory = async () => {
  const authEndpoint = 'https://api.hooktheory.com/v1/users/auth';
  const credentials = {
    username: process.env.REACT_APP_HOOKTHEORY_USERNAME,
    password: process.env.REACT_APP_HOOKTHEORY_PASSWORD
  };
  try {
    const response = await fetch(authEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.activkey;
  } catch (error) {
    console.error('Error retrieving the Bearer Token:', error);
  }
};

const fetchData = async (apiEndpoint, bearerToken, setApiTestResponse) => {
  try {
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    setApiTestResponse(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export { authenticateHooktheory, fetchData };