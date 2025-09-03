import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://api-dev.alemx.com';

export function createPost(token) {
  const res = http.post(`${BASE_URL}/posts`, JSON.stringify({
    caption: "Some Caption",
    hashtags: ["nature"],
    location: { name: "Test Post", latitude: 0, longitude: 0 },
    allow_comments: true,
    images: []
  }), {
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token
    }
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
    'response body is not empty': (r) => r.body && r.body.length > 0,
  });
}
