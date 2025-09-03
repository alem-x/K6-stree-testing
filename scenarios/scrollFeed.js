import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://api-dev.alemx.com';

export function scrollFeed(token) {
  const url = `${BASE_URL}/feed/`; // Replace if different

  const res = http.get(url, {
    headers: {
      'X-Token': token
    }
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
    'response body is not empty': (r) => r.body && r.body.length > 0,
  });
}
