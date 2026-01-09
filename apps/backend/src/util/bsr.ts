type BSRResponse = {
  value: string
  label: string
}

export type BSR = {
  Pstlz: string
  AddrKey: string
  PstlzKey: string
  Street: string
  StreetKey: string
  HouseNo: string
  District: string
  DistrictKey: string
  GeoLoc_X: string
  GeoLoc_Y: string
  DateFrom: string
  DateTo: string
  Category: string
  dates: Record<string, Appointment[]>
}

export enum Category {
  BI = 'Biogut',
  WS = 'Wertstoffe',
  WB = 'Weihnachtsbaum',
  HM = 'Hausmuell',
}

type Appointment = {
  category: keyof typeof Category
  serviceDay: string
  serviceDate_actual: string
  serviceDate_regular: string
  rhythm: string
  warningText: string
  disposalComp: string
}

export async function getBsrLocationFromAddress(
  street: string,
  streetNumber: string,
  plz: string
): Promise<BSRResponse> {
  console.debug('fetching id for location from bsr', street, streetNumber, plz)
  const bsrResponse = await fetch(
    `${process.env.BSR_BASE}/plzSet/plzSet?searchQuery=${encodeURIComponent(street)}:::${streetNumber}`,
    {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }
  )
  const bsrJson = (await bsrResponse.json()) as BSRResponse[]
  const bsrLocation = bsrJson.at(0)
  if (!bsrLocation) {
    throw new Error('Address not found')
  }
  console.debug('got', bsrLocation, 'from bsr')
  return bsrLocation
}

export async function getAppointmentsFromBsrLocation(address: string) {
  const currentYear = new Date().getFullYear()
  const query = `AddrKey eq '${address}' and DateFrom eq datetime'${currentYear}-01-01T00:00:00' and DateTo eq datetime'${currentYear}-12-31T00:00:00' and (Category eq 'HM' or Category eq 'BI' or Category eq 'WS' or Category eq 'LT' or Category eq 'WB')`
  const response = await fetch(
    `${process.env.BSR_BASE}/abfuhrEvents?filter=${encodeURIComponent(query)}`,
    {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }
  )
  const json = (await response.json()) as BSR
  return json.dates
}
