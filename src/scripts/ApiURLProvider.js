import {DEV_URL} from "@env"

export default function apiURLProvider() {
  if (process.env.NODE_ENV === 'development') {
    return DEV_URL;
  } else {
    return '';
  }
}
