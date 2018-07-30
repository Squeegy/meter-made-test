// @flow

import mapTimes from './map-times'
import hsv from './hsv'
import PatternColumn from './pattern-column'

export const NUM_COLUMNS = 10
export const NUM_LEDS_PER_METER = 4
export const NUM_METERS_PER_COLUMN = 9
export const NUM_LEDS_PER_COLUMN = NUM_LEDS_PER_METER * NUM_METERS_PER_COLUMN

export default class Pattern {
  columns: PatternColumn[]
  sensors: boolean[]
  running: boolean
  show: () => void

  constructor(showAllColumns: (PatternColumn[]) => void) {
    this.running = false
    this.show = () => showAllColumns(this.columns)
    this.columns = mapTimes(NUM_COLUMNS, i => new PatternColumn())
    this.sensors = mapTimes(NUM_COLUMNS, () => false)
  }

  setSensors(sensors: boolean[]) {
    this.sensors = sensors
  }

  begin() {
    this.running = true
    this.start()
    setTimeout(async () => {
      while (this.running) {
        await this.loop()
        await this.delay(1)
      }
    }, 10)
  }

  // Optionally, override.
  start() {}

  stop() {
    this.running = false
  }

  // Override
  async loop() {
    // Do nothing...
    await this.delay(100)
  }

  // Utility functions for use in patterns
  // -------------------------------------

  // Pause execution. Call with `await`.
  delay(ms: number): Promise<*> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Return an 8 bit sine value based on an 8 bit input.
  sin8(n: number): number {
    n %= 256
    if (n < 0) n + 256

    const sin = Math.sin((n / 256) * 2 * Math.PI)
    return Math.round(((sin + 1) / 2) * 255)
  }

  // Return an 8 bit cosine value based on an 8 bit input.
  cos8(n: number): number {
    n %= 256
    if (n < 0) n + 256

    const sin = Math.cos((n / 256) * 2 * Math.PI)
    return Math.round(((sin + 1) / 2) * 255)
  }

  map(x: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
    return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  }

  // Return an 8 bit x coordinate a column and meter index.
  x(col: number, meter: number): number {
    let offset = 0
    if (meter <= 1) offset = 255 / NUM_COLUMNS / 3
    if (meter == 0) offset = -offset

    let x = offset + (col * 255) / NUM_COLUMNS
    if (x < 0) x += 256
    return Math.round(x)
  }

  // Return an 8 bit y coordinate a column and meter index.
  y(col: number, meter: number): number {
    if (meter <= 1) return 255
    return Math.round(((NUM_METERS_PER_COLUMN - meter - 1) * 255) / (NUM_METERS_PER_COLUMN - 2))
  }
}
