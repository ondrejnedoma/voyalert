import {DEV_PORT, DEV_URL} from '@env';

export default function apiURLProvider() {
  if (process.env.NODE_ENV === 'development') {
    return DEV_URL + ':' + DEV_PORT;
  } else {
    return 'https://voyalert.102.nedomovi.net';
  }
}
