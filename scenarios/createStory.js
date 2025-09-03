import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://api-dev.alemx.com';

export function createStory(token) {
  const url = `${BASE_URL}/story`;

  const formData = {
    location: JSON.stringify({
      name: "testing loc",
      city: "Lviv",
      country: "Ukraine",
      latitude: 40.678,
      longitude: 45.989
    }),
    contents: JSON.stringify(["1"]),
    allow_comments: 'true',
  };

  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const payload = buildMultipartFormData(formData, boundary);

  const res = http.post(url, payload, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'X-Token': token
    }
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
    'response body is not empty': (r) => r.body && r.body.length > 0,
  });
}

// Helper function to build multipart/form-data
function buildMultipartFormData(fields, boundary) {
  let data = '';

  for (const name in fields) {
    data += `--${boundary}\r\n`;
    data += `Content-Disposition: form-data; name="${name}"\r\n\r\n`;
    data += `${fields[name]}\r\n`;
  }

  data += `--${boundary}--\r\n`;
  return data;
}
