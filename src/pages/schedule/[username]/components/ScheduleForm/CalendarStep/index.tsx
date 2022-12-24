import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'

import { Availability, CalendarStepProps } from './types'
import { api } from '../../../../../../libs/axios'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerList,
  TimePickerItem,
} from './styles'
import { Calendar } from '../../../../../../components/Calendar'

export function CalendarStep(props: CalendarStepProps) {
  const { onSelectDateTime } = props

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { query } = useRouter()

  const isDateSelected = !!selectedDate
  const username = String(query.username)

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate ? dayjs(selectedDate).format('DD[ de ]MMMM') : null
  const selectedDateWithoutTime = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null

  const { data: availability } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const { data } = await api.get(`/users/${username}/availability`, {
        params: { date: selectedDateWithoutTime },
      })
      return data
    },
    {
      enabled: !!selectedDate,
    },
  )

  const onSelectTime = (hour: number) => {
    const dateWithTime = dayjs(selectedDate).set('hour', hour).startOf('hour').toDate()
    onSelectDateTime(dateWithTime)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
              scrollbarWidth: 'thin',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '$gray600',
              scrollbarColor: '$gray500 $gray600',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '$gray500',
              borderRadius: '4px',
              '&:hover': {
                background: '$gray400',
              },
            },
          }}
        >
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((hour) => (
              <TimePickerItem
                key={hour}
                onClick={() => onSelectTime(hour)}
                disabled={!availability.availableTimes.includes(hour)}
              >
                {String(hour).padStart(2, '0')}:00h
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
