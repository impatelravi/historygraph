import React, { useEffect, useState } from "react";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IntlMessages from "Util/IntlMessages";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import DeviceHistoryChart from "./DeviceHistoryChart";
import SearchDateRange from "./SearchDateRange";
import SensorToggleButton from "../Devices/SensorButtonGroup/SensorToggleButton";
import { AxiosInstance, CancelToken } from "../../../../../services/settings";
// Table
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import moment from "moment-timezone";
import { DEVICES } from "../../deviceConstants";

const DeviceHistory = ({ model, device, deviceCode }) => {
  const [selectedTab, setSelectedtab] = useState("graph");
  const [startDate, setStartDate] = useState(
    moment().subtract(7, "days").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [timezone, setTimezone] = useState("");
  const [time24HourFormat, setTime24HourFormat] = useState(true);
  const [rows, setRows] = useState([]);

  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);

  const [openType, setOpenType] = useState("");
  const [closeType, setCloseType] = useState("");
  const [closeTypeTableHeader, setCloseTypeTableHeader] = useState("");
  const [openTypeTableHeader, setOpenTypeTableHeader] = useState("");

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const createdRows = (data) => {
    let results = [];
    let openData = [];
    let closeData = [];

    data.map((item, i) => {
      if (item.alert_type === openType) {
        openData.push({ open: item.created_at });
      } else {
        closeData.push({ close: item.created_at });
      }
    });
    if (openData.length >= closeData.length) {
      openData.map((item, i) => {
        if (
          (openData.length > closeData.length ||
            data[0].alert_type === openType) &&
          i === 0
        ) {
          results.push({ ...item });
        } else {
          results.push({ ...item, ...closeData[i] });
        }
      });
    } else {
      closeData.map((item, i) => {
        results.push({ ...item, ...openData[i] });
      });
    }
    setRows(results);
  };

  useEffect(() => {
    if (!openType) {
      alertTypeByModel();
    }
    if (openType) {
      getHistory();
    }
  }, [openType]);

  const handleSearch = () => {
    setPageSize(5);
    setPage(0);
    getHistory();
  };

  const alertTypeByModel = () => {
    switch (model) {
      case "OS600":
      case "SS882ZB":
      case "SS881ZB":
      case "SS912ZB":
        setOpenType("open");
        setCloseType("closed");
        setCloseTypeTableHeader("Close");
        setOpenTypeTableHeader("Open");
        break;
      case DEVICES.SS901ZB:
        setOpenType("open");
        setCloseType("closed");
        setCloseTypeTableHeader("Alarm Off");
        setOpenTypeTableHeader("Alarm On");
        break;
      case DEVICES.SC900ZB:  
      case DEVICES.SC824ZB:
      case DEVICES.SR600:
      case DEVICES.SPE600:
      case DEVICES.SP600:
      case DEVICES.SX885ZB:
        setOpenType("on");
        setCloseType("off");
        setCloseTypeTableHeader("Off");
        setOpenTypeTableHeader("On");
        break;
    }
  };

  const modelHistoryType = () => {
    switch (model) {
      case "OS600":
      case "SS882ZB":
      case "SS881ZB":
      case "SS912ZB":
      case DEVICES.SS901ZB:   
        return "openCloseStatus";
      case DEVICES.SC900ZB:  
      case DEVICES.SC824ZB:
      case DEVICES.SR600:
      case DEVICES.SPE600:
      case DEVICES.SP600:
      case DEVICES.SX885ZB:
        return "onOffStatus";
    }
  };

  const getHistory = () => {
    const source = CancelToken.source();
    setIsLoading(true);
    AxiosInstance.get("/devices/history", {
      cancelToken: source.token,
      params: {
        device_code: deviceCode,
        // page: page - 1, // Page starts from 0
        // limit: pageSize,
        start_time: startDate,
        end_time: endDate,
        type: modelHistoryType(), // Type based on Device
        order: "desc",
      },
    })
      .then(({ status, data }) => {
        if (status === 200 && data?.data) {
          const allData = data?.data;
          setNoResults(!(allData?.history?.length > 0));
          createdRows(allData?.history);
          setTimezone(allData?.timezone)
          if(allData?.timeFormat === 12) {
            setTime24HourFormat(false)
          }
          
        }

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setNoResults(true);
      });
  };

  const handleTabChange = (e, tab) => {
    if (tab === "graph" || tab === "table") {
      setSelectedtab(tab);
    }
  };

  const getFormattedDateAndTime = (date) => {
    if(time24HourFormat) {
      return timezone ? moment(date).tz(timezone).format("MM-DD h:mm:ss") : moment(date).utc().format("MM-DD h:mm:ss")
    } else {
      return timezone ? moment(date).tz(timezone).format("MM-DD h:mm:ss A") : moment(date).utc().format("MM-DD h:mm:ss A")
    }
  }

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="summary">
          <h1>
            <IntlMessages id="device.sensor.history" />
          </h1>
        </AccordionSummary>
        <AccordionDetails>
          <div
            className="table-div"
            style={{ minWidth: "-webkit-fill-available" }}
          >
            <div className="row">
              <SearchDateRange
                startDate={startDate}
                endDate={endDate}
                onchange={handleDateChange}
                search={handleSearch}
              />
              <SensorToggleButton handleSelection={handleTabChange} selected={selectedTab} />
            </div>
            {isLoading && <RctSectionLoader />}
            {selectedTab === "graph" && rows.length > 0 && (
              <DeviceHistoryChart
                allData={rows}
                selectedStartDate={startDate}
                selectedEndDate={endDate}
                timezone={timezone}
                positiveLabel={openTypeTableHeader}
                negitiveLabel={closeTypeTableHeader}
              />
            )}
            {selectedTab === "table" && rows.length > 0 && (
              <div className="mt-30">
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>{openTypeTableHeader}</TableCell>
                        <TableCell>{closeTypeTableHeader}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows
                        .slice(page * pageSize, page * pageSize + pageSize)
                        .map((row) => (
                          <TableRow key={row.open}>
                            <TableCell>
                              {row.open ? getFormattedDateAndTime(row.open): null}
                            </TableCell>
                            <TableCell>
                              {row.close ? getFormattedDateAndTime(row.close): null}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={pageSize}
                  page={page}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setPageSize(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                />
              </div>
            )}
            {noResults && <h1 className="p-30">
                          <IntlMessages id="device.sensor.history.noResultFound"/>
                          </h1>}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default DeviceHistory;
