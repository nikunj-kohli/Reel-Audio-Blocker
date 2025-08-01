import { PLATFORMS } from './constants.js';

export const detectPlatform = () => {
  const hostname = window.location.hostname;
  
  if (hostname.includes('instagram.com')) {
    return PLATFORMS.INSTAGRAM;
  } else if (hostname.includes('facebook.com')) {
    return PLATFORMS.FACEBOOK;
  } else if (hostname.includes('youtube.com')) {
    return PLATFORMS.YOUTUBE;
  }
  
  return null;
};