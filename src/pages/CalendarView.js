import React, { useEffect, useState, useCallback } from 'react'
import { Flex, Button, Heading } from '@looker/components'
import { getCoreSDK } from '@looker/extension-sdk-react'
import DetailsCard from '../components/DetailsCard'
import { CalendarWrapper, DetailsWrapper } from './CalendarViewStyles'
import {
  Eventcalendar,
  CalendarPrev,
  CalendarNext,
  CalendarToday,
} from '@mobiscroll/react'
import '@mobiscroll/react/dist/css/mobiscroll.react.min.css'
import moment from 'moment'

const CalendarView = ({ month, year, events }) => {
  const sdk = getCoreSDK()
  const [openDetails, setOpenDetails] = useState(false)

  const [selectedDate, setSelectedDate] = useState()

  const customTemplate = () => {
    return (
      <>
        {/* <CalendarPrev /> */}
        <CalendarToday />
        {/* <CalendarNext /> */}
        <div style={{ margin: 'auto' }}>
          {
            <Heading>
              <span>{moment(selectedDate).format('MMMM')}, </span>
              <span>{moment(selectedDate).format('YYYY')}</span>
            </Heading>
          }
        </div>
      </>
    )
  }

  useEffect(() => {
    if (month && year) {
      setSelectedDate(new Date(year, month - 1, 1))
    } else {
      setSelectedDate(new Date())
    }
  }, [month, year])

  const handleEventClick = (event, inst) => {
    console.log(event)
    setOpenDetails(true)
  }

  const onSelectedDateChange = useCallback((event, inst) => {
    setSelectedDate(event.date)
    // console.log(event)
  })

  return (
    <div>
      <Flex>
        <CalendarWrapper open={openDetails}>
          <Eventcalendar
            data={events}
            // onPageLoading={onPageLoading}
            renderHeader={customTemplate}
            onEventClick={handleEventClick}
            selectedDate={selectedDate}
            onSelectedDateChange={onSelectedDateChange}
            height="100%"
          />
        </CalendarWrapper>
        <DetailsWrapper open={openDetails}>
          <DetailsCard onClose={() => setOpenDetails(false)} />
        </DetailsWrapper>
      </Flex>
    </div>
  )
}

export default CalendarView
