import ical, {
  ICalAlarmType,
  ICalCalendar,
  ICalCalendarMethod,
  type ICalEventData,
} from 'ical-generator'
import { Category, type BSR } from './bsr.js'
import { writeFileSync } from 'fs'

const alarmTime = 60 * 60 * 6

export function generateCalendar(appointments: BSR['dates']) {
  const transformed = Object.entries(appointments).flatMap(
    ([dateAsString, appointmentsOnThatDay]) =>
      appointmentsOnThatDay.map(
        (appointment) =>
          ({
            allDay: true,
            description: appointment.warningText,
            end: new Date(dateAsString),
            start: new Date(dateAsString),
            summary: `(${appointment.disposalComp}) ${Category[appointment.category]}`,
            alarms: [
              {
                type: ICalAlarmType.display,
                trigger: alarmTime,
                description: `Morgen wird ${Category[appointment.category]} abgeholt.`,
              },
            ],
          }) satisfies ICalEventData
      )
  )

  const calendar = ical({
    name: 'BSR Abfuhrkalender',
    timezone: 'Europe/Berlin',
    events: transformed,
    method: ICalCalendarMethod.REQUEST,
  })
  return calendar
}

export function saveCalendarToFile(
  calendar: ICalCalendar,
  filename: string = 'events.ics'
) {
  return writeFileSync(filename, calendar.toString())
}
