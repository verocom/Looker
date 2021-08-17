import React from 'react'
import {
  CardContent,
  Heading,
  Paragraph,
  Flex,
  FlexItem,
  Divider,
  Card,
  IconButton,
} from '@looker/components'
import { StyledCard } from './DetailsCardStyles'
import { Close } from '@styled-icons/material'

const DetailsCard = ({ onClose }) => {
  return (
    <Card>
      <CardContent>
        <IconButton
          style={{ position: 'absolute', right: 3, top: 1 }}
          icon={<Close />}
          label="Close"
          size="large"
          onClick={onClose}
        />
        <Heading fontSize="xxxlarge">Thu Sep 10 2020</Heading>
        <Heading as="h4" fontSize="small">
          See Shift details for the selected date
        </Heading>
      </CardContent>
      <CardContent bg="#d3d3d3">
        <Paragraph color="blue"> Punch Times</Paragraph>
      </CardContent>
      <CardContent>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flexDirection="column">
            <FlexItem>
              <Heading as="h6" fontSize="large">
                Punch In
              </Heading>
            </FlexItem>
            <FlexItem>
              <Heading as="h6" fontSize="medium">
                -
              </Heading>
            </FlexItem>
          </Flex>
          <Flex flexDirection="column">
            <FlexItem>
              <Heading as="h6" fontSize="large">
                Punch Out
              </Heading>
            </FlexItem>
            <FlexItem>
              <Heading as="h6" fontSize="medium">
                -
              </Heading>
            </FlexItem>
          </Flex>
        </Flex>
        <Flex flexDirection="row">
          <FlexItem>
            <Heading as="h6" fontSize="large">
              Location :-
            </Heading>
          </FlexItem>
          <FlexItem ml="small">
            <Heading as="h6" fontSize="medium">
              -
            </Heading>
          </FlexItem>
        </Flex>
      </CardContent>
      <CardContent bg="#d3d3d3">
        <Paragraph color="blue">Scheduled:</Paragraph>
      </CardContent>
      <CardContent>
        <Paragraph> 8.00 AM - 4.30 PM</Paragraph>
        <Divider mt="medium" appearance="light" />
        <Flex mt="small">
          <FlexItem width="50%">12.30 PM - 1.00 pm</FlexItem>
          <FlexItem>Meal Break</FlexItem>
        </Flex>
      </CardContent>
      <CardContent bg="#d3d3d3">
        <Paragraph color="blue">Comments:</Paragraph>
      </CardContent>
      <CardContent>
        <Paragraph fontSize="large">-</Paragraph>
      </CardContent>
      <CardContent bg="#d3d3d3">
        <Paragraph color="blue">Attendance Events</Paragraph>
      </CardContent>
      <CardContent>
        <Flex flexDirection="column">
          <FlexItem>
            <Paragraph color="red" fontSize="medium">
              No punch with leave
            </Paragraph>
          </FlexItem>
          <FlexItem>
            <Paragraph fontWeight="bold" fontSize="medium">
              Balance Change :-
            </Paragraph>
          </FlexItem>
          <FlexItem>
            <Paragraph fontWeight="bold" fontSize="medium">
              Total :-
            </Paragraph>
          </FlexItem>
          <FlexItem>
            <Paragraph fontWeight="bold" fontSize="medium">
              Expiry :-
            </Paragraph>
          </FlexItem>
          <FlexItem>
            <Paragraph fontWeight="bold" fontSize="medium">
              Issued :-
            </Paragraph>
          </FlexItem>
        </Flex>
      </CardContent>
    </Card>
  )
}

export default DetailsCard
