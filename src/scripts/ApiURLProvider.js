export default function apiURLProvider() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://10.4.4.172:3000';
  } else {
    return '';
  }
}
