import { describe, it, expect } from 'vitest'
import { 
  lerp, 
  clamp, 
  smoothStep, 
  noise, 
  distance, 
  angle, 
  randomRange, 
  mapRange 
} from '../../src/utils/math.js'

describe('Math Utils', () => {
  describe('lerp', () => {
    it('should interpolate between two values', () => {
      expect(lerp(0, 10, 0.5)).toBe(5)
      expect(lerp(0, 100, 0.25)).toBe(25)
      expect(lerp(-10, 10, 0.5)).toBe(0)
    })

    it('should handle edge cases', () => {
      expect(lerp(5, 5, 0.5)).toBe(5)
      expect(lerp(0, 10, 0)).toBe(0)
      expect(lerp(0, 10, 1)).toBe(10)
    })
  })

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })

    it('should handle equal min and max', () => {
      expect(clamp(5, 3, 3)).toBe(3)
      expect(clamp(-1, 0, 0)).toBe(0)
    })
  })

  describe('smoothStep', () => {
    it('should provide smooth interpolation', () => {
      expect(smoothStep(0, 1, 0)).toBe(0)
      expect(smoothStep(0, 1, 1)).toBe(1)
      expect(smoothStep(0, 1, 0.5)).toBeCloseTo(0.5, 5)
    })

    it('should clamp values outside range', () => {
      expect(smoothStep(0, 1, -1)).toBe(0)
      expect(smoothStep(0, 1, 2)).toBe(1)
    })
  })

  describe('noise', () => {
    it('should generate deterministic pseudo-random values', () => {
      const n1 = noise(1, 1, 0)
      const n2 = noise(1, 1, 0)
      expect(n1).toBe(n2)
      expect(n1).toBeGreaterThanOrEqual(0)
      expect(n1).toBeLessThan(1)
    })

    it('should produce different values for different inputs', () => {
      const n1 = noise(1, 1, 0)
      const n2 = noise(2, 2, 0)
      expect(n1).not.toBe(n2)
    })

    it('should respect seed parameter', () => {
      const n1 = noise(1, 1, 0)
      const n2 = noise(1, 1, 1)
      expect(n1).not.toBe(n2)
    })
  })

  describe('distance', () => {
    it('should calculate euclidean distance', () => {
      expect(distance(0, 0, 3, 4)).toBe(5)
      expect(distance(0, 0, 0, 0)).toBe(0)
      expect(distance(-1, -1, 2, 3)).toBeCloseTo(5, 5)
    })

    it('should handle negative coordinates', () => {
      expect(distance(-5, -5, -2, -1)).toBe(5)
    })
  })

  describe('angle', () => {
    it('should calculate angle in radians', () => {
      expect(angle(0, 0, 1, 0)).toBe(0)
      expect(angle(0, 0, 0, 1)).toBeCloseTo(Math.PI / 2, 5)
      expect(angle(0, 0, -1, 0)).toBeCloseTo(Math.PI, 5)
      expect(angle(0, 0, 0, -1)).toBeCloseTo(-Math.PI / 2, 5)
    })
  })

  describe('randomRange', () => {
    it('should generate values within range', () => {
      for (let i = 0; i < 100; i++) {
        const val = randomRange(10, 20)
        expect(val).toBeGreaterThanOrEqual(10)
        expect(val).toBeLessThanOrEqual(20)
      }
    })

    it('should handle negative ranges', () => {
      for (let i = 0; i < 100; i++) {
        const val = randomRange(-20, -10)
        expect(val).toBeGreaterThanOrEqual(-20)
        expect(val).toBeLessThanOrEqual(-10)
      }
    })
  })

  describe('mapRange', () => {
    it('should map values between ranges', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50)
      expect(mapRange(0, 0, 10, 0, 100)).toBe(0)
      expect(mapRange(10, 0, 10, 0, 100)).toBe(100)
    })

    it('should handle inverse mapping', () => {
      expect(mapRange(5, 0, 10, 100, 0)).toBe(50)
    })

    it('should handle negative ranges', () => {
      expect(mapRange(0, -10, 10, -100, 100)).toBe(0)
      expect(mapRange(-10, -10, 10, -100, 100)).toBe(-100)
    })
  })
})