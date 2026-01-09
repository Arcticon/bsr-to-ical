export function decodeStreetAndNumber(street: string, number: string) {
  const decodedStreet = decodeURIComponent(street)
  const decodedNumber = decodeURIComponent(number)
  return { street: decodedStreet, number: decodedNumber }
}
