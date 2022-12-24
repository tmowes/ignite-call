import dayjs from 'dayjs'

export type CalendarWeek = {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

export type CalendarWeeks = CalendarWeek[]

export type BlockedDates = {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export type CalendarProps = {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}
