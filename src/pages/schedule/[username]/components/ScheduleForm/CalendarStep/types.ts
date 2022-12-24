export type CalendarStepProps = {
  onSelectDateTime: (date: Date) => void
}

export type Availability = {
  possibleTimes: number[]
  availableTimes: number[]
}
