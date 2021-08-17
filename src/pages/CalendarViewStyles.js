import { FlexItem } from '@looker/components'
import styled from 'styled-components'

export const FilterContainer = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0f0;
  box-sizing: border-box;
  border-radius: 12px;
  margin-top: 2%;
  padding: 2%;
`

export const CalendarWrapper = styled(FlexItem)`
  margin-right: ${(props) => (props.open ? '20%' : '0')};
  transition: 0.5s;
  width: ${(props) => (props.open ? '80%' : '100%')};
`
export const DetailsWrapper = styled(FlexItem)`
  height: 100%;
  width: ${(props) => (props.open ? '20%' : '0')};
  position: absolute;
  z-index: 1;
  right: 0;
  overflow: auto;
  transition: 0.5s;
  min-width: 0 !important;
  transition: 0.5s;
  @media (max-width: 768px) {
  }
`

export const EmbedContainer = styled.div`
  width: 100%;
  height: 95vh;
  & > iframe {
    width: 100%;
    height: 100%;
  }
`
