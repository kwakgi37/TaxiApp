import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.0.12:3000',
  timeout: 10000,
});

export default {
  test() {
    return instance.get('/taxi/test');
  },
  login(id: string, pw: string) {
    return instance.post('/taxi/login', {userId: id, userPw: pw});
  },
  register(id: string, pw: string) {
    return instance.post('/taxi/register', {userId: id, userPw: pw});
  },
  list(id: string) {
    return instance.post('/taxi/list', {userId: id});
  },
};
