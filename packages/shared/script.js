import http from 'k6/http';
import { check, sleep } from 'k6';

// Set the number of virtual users and duration of the test
export let options = {
  vus: 50, // reduced number of virtual users
  duration: '1m', // reduced test duration to prevent overloading
  thresholds: {
    http_req_failed: ['rate<0.05'], // Allow up to 5% failure rate
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
};

// Define the API base URL
const BASE_URL = 'https://chat-app-vkve.onrender.com'; // Your service URL

// The test logic to be executed by each virtual user
export default function () {
  // Generate a random 10-digit phone number
  let phone = `${Math.floor(Math.random() * 10000000000)}`.padStart(10, '0');

  // Test the /signup endpoint
  let signupRes = http.post(
    `${BASE_URL}/auth/signup`,
    JSON.stringify({
      phone,
      password: 'testpassword',
      name: 'soumo',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(signupRes, {
    'signup status was 200': (r) => r.status === 200,
  });

  // Test the /login endpoint
  let loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      phone,
      password: 'testpassword',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(loginRes, {
    'login status was 200': (r) => r.status === 200,
  });

  // Sleep between requests to simulate real-world usage and reduce load
  sleep(2);
}
