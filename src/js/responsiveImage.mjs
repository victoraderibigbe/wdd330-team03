export function responsiveImageAttributes(images, sizes) {
  const large = images?.PrimaryLarge || images?.PrimaryMedium;
  const medium = images?.PrimaryMedium || large;

  if (!medium && !large) {
    throw new Error('Product image sources are missing.');
  }

  return `src="${large}" srcset="${medium} 160w, ${large} 320w" sizes="${sizes}"`;
}
