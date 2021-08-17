import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Select,
  Box,
  ButtonToggle,
  Flex,
  Button,
  Icon,
  Tooltip,
  Popover,
  SelectMulti,
} from "@looker/components";
import CalendarView from "./CalendarView";
import { BrowseTable, CalendarMonth } from "@looker/icons";
import { InputDateRange, DateFormat } from "@looker/components-date";
import { getCoreSDK, ExtensionContext } from "@looker/extension-sdk-react";
import { EmbedContainer } from "./CalendarViewStyles";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import DashboardView from "./DashboardView";
import moment from "moment";

const ExtensionView = () => {
  const sdk = getCoreSDK();

  const extensionContext = useContext(ExtensionContext);
  const [dashboardNext, setDashboardNext] = useState(true);
  const [monthOptions, setMonthOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [eventTypeOptions, setEventTypeOptions] = useState();
  const [switchValue, setSwitchValue] = useState("calendar");
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [month, setMonth] = useState();
  const [year, setYear] = useState("2021");
  const [eventType, setEventType] = useState();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEventTypes = async () => {
      try {
        let response = await sdk.ok(
          sdk.run_inline_query({
            result_format: "json",
            body: {
              model: "workjam_dev",
              view: "ext_apple_attendancedetailswidget_tbl",
              fields: [
                "ext_apple_attendancedetailswidget_tbl.event_type",
                "ext_apple_attendancedetailswidget_tbl.tracking_period",
              ],
              total: false,
              runtime: 0,
            },
          })
        );
        console.log(response);
        if (response[0].looker_error) {
          console.error(response[0].looker_error);
        } else {
          let tempEventTypes = [];
          response.forEach((element) => {
            tempEventTypes.push({
              value:
                element["ext_apple_attendancedetailswidget_tbl.event_type"],
              label:
                element["ext_apple_attendancedetailswidget_tbl.event_type"],
            });
          });
          setEventTypeOptions(tempEventTypes);
          let trackingPeriod =
            response[0][
              "ext_apple_attendancedetailswidget_tbl.tracking_period"
            ];
          let startDate = moment().subtract(trackingPeriod + 1, "days");
          let endDate = new Date();
          let months = [];
          let years = new Set();
          while (startDate.isSameOrBefore(endDate)) {
            months.push({
              value: startDate.format("MM"),
              label: startDate.format("MMMM"),
            });
            years.add({
              value: startDate.format("YYYY"),
              label: startDate.format("YYYY"),
            });
            startDate.add(1, "month");
          }
          setMonthOptions(months);
          setYearOptions([...years]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getEventTypes();
  }, []);

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl;
      if (el && hostUrl) {
        el.innerHTML = "";
        LookerEmbedSDK.init(hostUrl);
        const db = LookerEmbedSDK.createDashboardWithId(
          "r6VgNRY5PoI6ZUxB7boF2X"
        );
        if (dashboardNext) {
          db.withNext();
        }
        db.appendTo(el)
          // .on('dashboard:loaded', updateRunButton.bind(null, false))
          // .on('dashboard:run:start', updateRunButton.bind(null, true))
          // .on('dashboard:run:complete', updateRunButton.bind(null, false))
          // .on('drillmenu:click', canceller)
          // .on('drillmodal:explore', canceller)
          // .on('dashboard:tile:explore', canceller)
          // .on('dashboard:tile:view', canceller)
          .build()
          .connect()
          // .then(setupDashboard)
          .catch((error) => {
            console.error("Connection error", error);
          });
      }
    },
    [dashboardNext]
  );

  console.log(yearOptions);

  useEffect(() => {
    // Getting Data whenever any filter changes!
    const getEvents = async () => {
      try {
        let response = await sdk.ok(
          sdk.run_inline_query({
            result_format: "json",
            body: {
              model: "workjam_dev",
              view: "ext_apple_attendancedetailswidget_tbl",
              fields: [
                "ext_apple_attendancedetailswidget_tbl.event_color",
                "ext_apple_attendancedetailswidget_tbl.event_name",
                "ext_apple_attendancedetailswidget_tbl.event_date",
                "ext_apple_attendancedetailswidget_tbl.event_type",
              ],
              filters: {
                "ext_apple_attendancedetailswidget_tbl.event_type":
                  eventType?.length > 0 ? eventType.join() : "",

                "ext_apple_attendancedetailswidget_tbl.event_date":
                  month && year ? year + "-" + month : "",
              },
              total: false,
              runtime: 0,
            },
          })
        );
        console.log(response);
        if (response[0]?.looker_error) {
          console.error(response[0].looker_error);
        } else {
          let tempEvents = [];
          response.forEach((element) => {
            tempEvents.push({
              color:
                element["ext_apple_attendancedetailswidget_tbl.event_color"],
              title:
                element["ext_apple_attendancedetailswidget_tbl.event_name"],
              date: element["ext_apple_attendancedetailswidget_tbl.event_date"],
            });
          });

          setEvents(tempEvents);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getEvents();
  }, [month, year, eventType]);

  // const onPageLoading = useCallback(async (event, inst) => {
  //   try {
  //     let response = await sdk.ok(
  //       sdk.run_inline_query({
  //         result_format: 'json',
  //         body: {
  //           model: 'workjam_dev',
  //           view: 'ext_apple_attendancedetailswidget_tbl',
  //           fields: [
  //             'ext_apple_attendancedetailswidget_tbl.event_color',
  //             'ext_apple_attendancedetailswidget_tbl.event_name',
  //             'ext_apple_attendancedetailswidget_tbl.event_date',
  //           ],
  //           total: false,
  //           runtime: 0,
  //         },
  //       })
  //     )
  //     if (response[0].looker_error) {
  //       console.error(response[0].looker_error)
  //     } else {
  //       let tempEvents = []
  //       response.forEach((element) => {
  //         tempEvents.push({
  //           color: element['ext_apple_attendancedetailswidget_tbl.event_color'],
  //           title: element['ext_apple_attendancedetailswidget_tbl.event_name'],
  //           date: element['ext_apple_attendancedetailswidget_tbl.event_date'],
  //           // end: element['ext_apple_attendancedetailswidget_tbl.event_date'],
  //         })
  //       })
  //       setEvents(tempEvents)
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }, [])

  return (
    <div>
      <EmbedContainer ref={embedCtrRef} />
      <div>
        <Box display="flex" justifyContent="flex-end" mr="xlarge" mt="xlarge">
          <ButtonToggle
            options={[
              {
                label: (
                  <Tooltip content="Calendar">
                    <Icon icon={<CalendarMonth />} />
                  </Tooltip>
                ),
                value: "calendar",
              },
              {
                label: (
                  <Tooltip content="List">
                    <Icon icon={<BrowseTable />} />
                  </Tooltip>
                ),
                value: "list",
              },
            ]}
            onChange={setSwitchValue}
            value={switchValue}
          ></ButtonToggle>
        </Box>
        <Box
          my="xlarge"
          mx="xlarge"
          borderRadius="12px"
          border="1px solid #f0f0f0"
          p="medium"
        >
          <Flex
            flexDirection={[
              "column", // column up to the first breakpoint
              null, // stay a column past first breakpoint
              "row", // switch to row layout after second breakpoint
            ]}
          >
            {switchValue === "list" ? (
              <Popover
                placement="bottom-start"
                content={
                  <Box p="small">
                    <InputDateRange
                      defaultValue={selectedDateRange}
                      onChange={setSelectedDateRange}
                    />
                  </Box>
                }
              >
                <Button
                  style={{
                    color: "#C1C6CC",
                    background: "transparent",
                    borderColor: "inherit",
                  }}
                  mr="large"
                  mb="medium"
                  placeholder="Select Date Range"
                >
                  <DateFormat>{selectedDateRange.from}</DateFormat> &mdash;
                  <DateFormat>{selectedDateRange.to}</DateFormat>
                </Button>
              </Popover>
            ) : (
              <>
                <Select
                  options={monthOptions}
                  placeholder="Select Month"
                  maxWidth={200}
                  mr="large"
                  mb="medium"
                  onChange={setMonth}
                />
                <Select
                  options={yearOptions}
                  placeholder="Select Year"
                  maxWidth={150}
                  mr="large"
                  mb="medium"
                  onChange={setYear}
                  value={year}
                />
              </>
            )}
            <SelectMulti
              options={eventTypeOptions}
              placeholder="Select Event Type"
              maxWidth={400}
              mr="large"
              mb="medium"
              flex={1}
              onChange={setEventType}
            />
          </Flex>
        </Box>
        {switchValue === "calendar" ? (
          <CalendarView
            // onPageLoading={onPageLoading}
            month={month}
            year={year}
            events={events}
          />
        ) : (
          <DashboardView />
        )}
      </div>
    </div>
  );
};

export default ExtensionView;
