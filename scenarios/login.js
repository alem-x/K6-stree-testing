import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://api-dev.alemx.com';
const csvFile = open('../data/accounts.csv');
const emails = csvFile.split('\n').slice(1).map(e => e.trim()).filter(Boolean);

export function login(email) {
  const res = http.post(`${BASE_URL}/user/login`, JSON.stringify({
    identity: email,
    password: 'someTest'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
    'response body is not empty': (r) => r.body && r.body.length > 0,
  });

  return res.headers['X-Token'];
}