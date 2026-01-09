import fastify, { type FastifySchema } from 'fastify'
import {
  getAppointmentsFromBsrLocation,
  getBsrLocationFromAddress,
} from './util/bsr.js'
import { generateCalendar } from './util/ical.js'

const app = fastify({ logger: true })

type Query = {
  street: string
  number: string
  plz: string
}

const IcalQuerySchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      street: { type: 'string' },
      number: { type: 'string' },
      plz: { type: 'string' },
    },
    required: ['street', 'number', 'plz'],
  },
} as const

app.get<{ Querystring: Query }>(
  '/ical',
  { schema: IcalQuerySchema },
  async (request, reply) => {
    const { street, number, plz } = request.query

    if (!street || !number) {
      reply.status(400).send({
        ok: false,
        issue: 'Invalid address parameters',
      })
      return
    }

    try {
      const { value } = await getBsrLocationFromAddress(street, number, plz)
      const appointments = await getAppointmentsFromBsrLocation(value)

      const calendar = generateCalendar(appointments)

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
