import fastify, { type FastifySchema } from 'fastify'
import {
  Category,
  filterByCategories,
  getAppointmentsFromBsrLocation,
  getBsrLocationFromAddress,
} from './util/bsr.js'
import { generateCalendar } from './util/ical.js'

const app = fastify({ logger: true })

type Query = {
  street: string
  number: string
  zipcode: string
  categories: string
}

const IcalQuerySchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      street: { type: 'string' },
      number: { type: 'string' },
      zipcode: { type: 'string', pattern: '^1' },
      categories: { type: 'string' },
    },
    required: ['street', 'number', 'zipcode', 'categories'],
  },
} as const

app.get<{ Querystring: Query }>(
  '/ical',
  { schema: IcalQuerySchema },
  async (request, reply) => {
    const { street, number, zipcode, categories } = request.query

    if (!street || !number) {
      reply.status(400).send({
        ok: false,
        issue: 'Invalid address parameters',
      })
      return
    }

    const validCategoryKeys = Object.keys(Category) as (keyof typeof Category)[]
    const selectedCategories = categories
      .split(',')
      .filter((category): category is keyof typeof Category =>
        (validCategoryKeys as string[]).includes(category)
      )

    try {
      const locations = await getBsrLocationFromAddress(street, number)
      if (!locations.length) {
        throw new Error('Address not found for the given postal code')
      }
      const location =
        locations.length === 1
          ? locations.at(0)
          : locations.find((location) => location.label.includes(zipcode))
      if (!location) {
        throw new Error('Address not found for the given postal code')
      }
      const { value } = location
      const allAppointments = await getAppointmentsFromBsrLocation(value)
      const filteredAppointments = filterByCategories(
        allAppointments,
        selectedCategories
      )

      const calendar = generateCalendar(filteredAppointments)

      reply.type('text/calendar; charset=utf-8')
      reply.header('Content-Disposition', 'inline')
      reply.header('Cache-Control', 'no-cache, no-store, must-revalidate')

      return calendar.toString()
    } catch (error) {
      app.log.error(error)
      reply.status(400).send({
        ok: false,
        issue: 'Address not found',
      })
      return
    }
  }
)

const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' })
    console.log('Server listening on http://localhost:3001')
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()
