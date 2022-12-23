import { useRouter } from 'next/router'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { Container, FormError, Header } from '../styles'
import {
  defaultValues,
  TimeIntervalsFormInput,
  TimeIntervalsFormOutput,
  timeIntervalsFormSchema,
} from './schema'
import { getWeekDays } from '../../../helpers/convert/getWeekDaysParams'
import {
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
} from './styles'
import { api } from '../../../libs/axios'

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues,
  })

  const { push } = useRouter()

  const weekDays = getWeekDays()

  const { fields } = useFieldArray({ control, name: 'intervals' })

  const watchIntervals = watch('intervals')

  // any here because this issue https://github.com/react-hook-form/react-hook-form/issues/9600
  const onSetTimeIntervals = async (data: any) => {
    const { intervals } = data as TimeIntervalsFormOutput
    try {
      await api.post('/users/time-intervals', { intervals })
      await push('/register/update-profile')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horário que você está disponível em cada dia da semana.
        </Text>
        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(onSetTimeIntervals)}>
        <IntervalContainer>
          {fields.map((field, index) => (
            <IntervalItem key={field.id}>
              <IntervalDay>
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={(item) => (
                    <Checkbox
                      onCheckedChange={(checked) => item.field.onChange(checked === true)}
                      checked={item.field.value}
                    />
                  )}
                />
                <Text>{weekDays[field.weekDay]}</Text>
              </IntervalDay>
              <IntervalInputs>
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={watchIntervals[index].enabled === false}
                  {...register(`intervals.${index}.startTime`)}
                />
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={watchIntervals[index].enabled === false}
                  {...register(`intervals.${index}.endTime`)}
                />
              </IntervalInputs>
            </IntervalItem>
          ))}
        </IntervalContainer>
        {errors.intervals && <FormError size="sm">{errors.intervals.message}</FormError>}
        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}
