import { describe, it, expect } from 'vitest'
import { colorSchemes, hexToRgba, getRandomColor, blendColors } from '../../src/utils/color.js'

describe('Color Utils', () => {
  describe('colorSchemes', () => {
    it('should have all required color schemes', () => {
      const expectedSchemes = ['aqua', 'ocean', 'aurora', 'vapor', 'ice', 'plasma', 'nebula', 'colorblind']
      expectedSchemes.forEach(scheme => {
        expect(colorSchemes).toHaveProperty(scheme)
        expect(colorSchemes[scheme]).toHaveProperty('primary')
        expect(colorSchemes[scheme]).toHaveProperty('secondary')
        expect(colorSchemes[scheme]).toHaveProperty('background')
      })
    })

    it('should have valid color arrays', () => {
      Object.values(colorSchemes).forEach(scheme => {
        expect(Array.isArray(scheme.primary)).toBe(true)
        expect(Array.isArray(scheme.secondary)).toBe(true)
        expect(scheme.primary.length).toBeGreaterThan(0)
        expect(scheme.secondary.length).toBeGreaterThan(0)
      })
    })

    it('colorblind scheme should use accessible colors', () => {
      const cbScheme = colorSchemes.colorblind
      expect(cbScheme.primary).toContain('#0173b2')
      expect(cbScheme.secondary).toContain('#e69f00')
    })
  })

  describe('hexToRgba', () => {
    it('should convert hex to rgba', () => {
      expect(hexToRgba('#ffffff', 1)).toBe('rgba(255, 255, 255, 1)')
      expect(hexToRgba('#000000', 0.5)).toBe('rgba(0, 0, 0, 0.5)')
      expect(hexToRgba('#ff0000', 0.8)).toBe('rgba(255, 0, 0, 0.8)')
    })

    it('should handle hex without hash', () => {
      expect(hexToRgba('ffffff', 1)).toBe('rgba(255, 255, 255, 1)')
      expect(hexToRgba('00ff00', 0.5)).toBe('rgba(0, 255, 0, 0.5)')
    })

    it('should default alpha to 1', () => {
      expect(hexToRgba('#ffffff')).toBe('rgba(255, 255, 255, 1)')
    })

    it('should return original value for invalid hex', () => {
      expect(hexToRgba('invalid')).toBe('invalid')
      expect(hexToRgba('#gggggg')).toBe('#gggggg')
    })
  })

  describe('getRandomColor', () => {
    it('should return a color from the specified scheme', () => {
      const aquaColor = getRandomColor('aqua')
      const allAquaColors = [...colorSchemes.aqua.primary, ...colorSchemes.aqua.secondary]
      expect(allAquaColors).toContain(aquaColor)
    })

    it('should return different colors on multiple calls', () => {
      const colors = new Set()
      for (let i = 0; i < 20; i++) {
        colors.add(getRandomColor('aurora'))
      }
      expect(colors.size).toBeGreaterThan(1)
    })
  })

  describe('blendColors', () => {
    it('should blend two colors', () => {
      const result = blendColors('#ff0000', '#0000ff', 0.5)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('should handle edge blending factors', () => {
      expect(blendColors('#ff0000', '#0000ff', 0)).toBe('#ff0000')
      expect(blendColors('#ff0000', '#0000ff', 1)).toBe('#0000ff')
    })
  })
})