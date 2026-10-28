const colors = {
    primary: '#C7B8FF',
    primary_light: '#E6E0FF',
    primary_dark: '#9E8CFF',
    primary_darken: '#7564d1',
    accent: '#B8EBD0',
    accent_light: '#E6F7EF',
    accent_dark: '#8FD6B5',
} as const

type Colors = typeof colors
export type ColorKey = keyof Colors

export default colors as Record<ColorKey, string>
