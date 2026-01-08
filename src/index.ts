import fastify, { type FastifySchema } from 'fastify'
import { getAppointmentsFromBSR, getPLZFromAddress } from './util/bsr.js'
import { generateCalendar } from './util/ical.js'

const app = fastify({ logger: true })

type Query = {
  street: string
  number: string
}

const IcalQuerySchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      street: { type: 'string' },
      number: { type: 'string' },
    },
    required: ['street', 'number'],
  },
} as const

app.get<{ Querystring: Query }>(
  '/ical',
  { schema: IcalQuerySchema },
  async (request, reply) => {
    const { street, number } = request.query

    const { value } = await getPLZFromAddress(street, number)
    const appointments = await getAppointmentsFromBSR(value)

    const calendar = generateCalendar(appointments)

    reply.type('text/calendar; charset=utf-8')
    reply.header('Content-Disposition', 'inline')
    reply.header('Cache-Control', 'no-cache, no-store, must-revalidate')

    return calendar.toString()
  }
)

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
    console.log('Server listening on http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
