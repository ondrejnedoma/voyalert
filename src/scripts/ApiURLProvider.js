import {DEV_URL, DEV_PORT} from "@env"

export default function apiURLProvider() {
  if (process.env.NODE_ENV === 'development') {
    return DEV_URL + ":" + DEV_PORT;
  } else {
    return '';
  }
}
