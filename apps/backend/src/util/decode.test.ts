import { describe, expect, it } from 'vitest'
import { decodeStreetAndNumber } from './decode.js'

describe('decode', () => {
  describe('.decodeStreetAndNumber', () => {
    it.each([
      [
        encodeURIComponent('Mein Weg'),
        '3',
        { street: 'Mein Weg', number: '3' },
      ],
      [
        encodeURIComponent('Mein Weg'),
        '3a',
        { street: 'Mein Weg', number: '3a' },
      ],
    ])(
      'should return a correct street and number',
      (street, number, expected) => {
        expect(decodeStreetAndNumber(street, number)).to.eql(expected)
      }
    )
  })
})
