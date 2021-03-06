//import React, { useEffect, useState } from "react";
//import moment from 'moment-timezone';

import {moment} from "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js";
import * as d3 from "d3";

allData [
    {
        "open": "2022-04-05T00:49:17.877Z"
    },
    {
        "open": "2022-03-21T06:04:18.329Z",
        "close": "2022-02-18T07:27:18.926Z"
    },
    {
        "open": "2022-02-18T07:14:50.251Z",
        "close": "2022-02-17T12:47:25.814Z"
    }
]

selectedStartDate = '2022-02-17'
selectedEndDate = '2022-04-05'
timezone = 'Indian/Mauritius'
positiveLabel = 'on'
negitiveLabel = "off"

const DeviceHistoryChart = ({ allData, selectedStartDate, selectedEndDate, positiveLabel, negitiveLabel, timezone }) => {
const [dataPoints, setDataPoints] = useState([]);
    useEffect(() => {
        setStatusNamesAndLabelArr()
        if(dataPoints.length) {
            drawGraph(dataPoints)
        } else {
            setDataPoints(dataProcessing());
        }
    }, [allData, dataPoints, timezone]);

    if (!allData) {
        return null;
    }

DeviceHistoryChart(allData, selectedStartDate, selectedEndDate, positiveLabel, negitiveLabel, timezone);

function DeviceHistoryChart(allData, selectedStartDate, selectedEndDate, positiveLabel, negitiveLabel, timezone){
        const dataPoints = [];
        const setDataPoints = [];
        setStatusNamesAndLabelArr()
        if(dataPoints.length) {
            drawGraph(dataPoints)
        } else {
            setDataPoints(dataProcessing());
        }

        if (!allData) {
            return null;
        }


    let statusNames = {};
    let labelArr = [];

    const setStatusNamesAndLabelArr = () => {

        // 1st Label
        statusNames.open = {
            name: positiveLabel,
            color: "#068c7e"
        }

        // 2st Label
        statusNames.close = {
            name: negitiveLabel,
            color: "#eee"
        };

        labelArr.push(statusNames.open);
        labelArr.push(statusNames.close);
    }

    const dataProcessing = () => {
        let dayFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
        let timeFormat = d3.time.format("%H:%M:%S");
        let newDataObj = [];
        let newData = [];
        const dataArr = [...allData]
        dataArr.reverse().map((value, index) => {
            let positiveDate = moment(value.open).utc().format('YYYY-MM-DD h:mm:ss');
            let negativeDate = moment(value.close).utc().format('YYYY-MM-DD h:mm:ss');
            if(timezone) {
                positiveDate = moment(value.open).tz(timezone).format('YYYY-MM-DD h:mm:ss');
                negativeDate = moment(value.close).tz(timezone).format('YYYY-MM-DD h:mm:ss'); 
            }
            if (positiveDate) {
                newData.push({
                    status: "open",
                    positiveDate: positiveDate,
                    negativeDate: negativeDate
                });
            }
            if (negativeDate) {
                newData.push({
                    status: "close",
                    positiveDate: negativeDate,
                    negativeDate: dataArr[index + 1] && dataArr[index + 1].open ? moment(dataArr[index + 1].open).format('YYYY-MM-DD h:mm:ss') : null
                });
            }
        });

        let currentTime = moment().format('YYYY-MM-DD h:mm:ss');
        let startSearchTime = moment(selectedStartDate).format('YYYY-MM-DD h:mm:ss');
        let endSearchTime = moment(selectedEndDate).format('YYYY-MM-DD h:mm:ss');

        newData.map((dataValue) => {
            let startOpenTime = dataValue.positiveDate;
            let endOpenTime = dataValue.negativeDate;
            if (startOpenTime && endOpenTime) {
                let startOpenTimeArray = startOpenTime.split(" ");
                let endOpenTimeArray = endOpenTime.split(" ");
                if (startOpenTimeArray[0] === endOpenTimeArray[0]) {
                    newDataObj.push({
                        status: dataValue.status,
                        startDay: dayFormat.parse(startOpenTimeArray[0] + " 00:00:00"),
                        endDay: dayFormat.parse(endOpenTimeArray[0] + " 24:00:00"),
                        startTime: timeFormat.parse(startOpenTimeArray[1]),
                        endTime: timeFormat.parse(endOpenTimeArray[1])
                    });
                } else {
                    newDataObj.push({
                        status: dataValue.status,
                        startDay: dayFormat.parse(startOpenTimeArray[0] + " 00:00:00"),
                        endDay: dayFormat.parse(startOpenTimeArray[0] + " 24:00:00"),
                        startTime: timeFormat.parse(startOpenTimeArray[1]),
                        endTime: timeFormat.parse("23:59:59")
                    });

                    let nextDay = moment(startOpenTime).add(1, 'days').format("YYYY-MM-DD");
                    let beforeDay = moment(endOpenTime).subtract(1, 'days').format("YYYY-MM-DD");

                    if (nextDay !== endOpenTimeArray[0]) {
                        newDataObj.push({
                            status: dataValue.status,
                            startDay: dayFormat.parse(nextDay + " 00:00:00"),
                            endDay: dayFormat.parse(beforeDay + " 24:00:00"),
                            startTime: timeFormat.parse("00:00:00"),
                            endTime: timeFormat.parse("23:59:59")
                        });
                    }

                    newDataObj.push({
                        status: dataValue.status,
                        startDay: dayFormat.parse(endOpenTimeArray[0] + " 00:00:00"),
                        endDay: dayFormat.parse(endOpenTimeArray[0] + " 24:00:00"),
                        startTime: timeFormat.parse("00:00:00"),
                        endTime: timeFormat.parse(endOpenTimeArray[1])
                    });
                }
            } else if (startOpenTime) {
                let startOpenTimeArray = startOpenTime.split(" ");
                let currentTimeArray = currentTime.split(" ");
                let endSearchTimeArray = endSearchTime.split(" ");

                if (startOpenTimeArray[0] === currentTimeArray[0]) {
                    newDataObj.push({
                        status: dataValue.status,
                        startDay: dayFormat.parse(startOpenTimeArray[0] + " 00:00:00"),
                        endDay: dayFormat.parse(currentTimeArray[0] + " 24:00:00"),
                        startTime: timeFormat.parse(startOpenTimeArray[1]),
                        endTime: timeFormat.parse(currentTimeArray[1])
                    });
                } else if (startOpenTimeArray[0] === endSearchTimeArray[0]) {
                    newDataObj.push({
                        status: dataValue.status,
                        startDay: dayFormat.parse(startOpenTimeArray[0] + " 00:00:00"),
                        endDay: dayFormat.parse(endSearchTimeArray[0] + " 24:00:00"),
                        startTime: timeFormat.parse(startOpenTimeArray[1]),
                        endTime: timeFormat.parse(endSearchTimeArray[1])
                    });
                } else {
                    newDataObj.push({
                        status: dataValue.status,
                        startDay: dayFormat.parse(startOpenTimeArray[0] + " 00:00:00"),
                        endDay: dayFormat.parse(startOpenTimeArray[0] + " 24:00:00"),
                        startTime: timeFormat.parse(startOpenTimeArray[1]),
                        endTime: timeFormat.parse("23:59:59")
                    });

                    let nextDay = moment(startOpenTime).add(1, 'd').format("YYYY-MM-DD");
                    if (endSearchTimeArray[0] === currentTimeArray[0]) {
                        let beforeDay = moment(currentTime).subtract(1, 'days').format("YYYY-MM-DD");
                        if (nextDay !== currentTimeArray[0]) {
                            newDataObj.push({
                                status: dataValue.status,
                                startDay: dayFormat.parse(nextDay + " 00:00:00"),
                                endDay: dayFormat.parse(beforeDay + " 24:00:00"),
                                startTime: timeFormat.parse("00:00:00"),
                                endTime: timeFormat.parse("23:59:59")
                            });
                        }

                        newDataObj.push({
                            status: dataValue.status,
                            startDay: dayFormat.parse(currentTimeArray[0] + " 00:00:00"),
                            endDay: dayFormat.parse(currentTimeArray[0] + " 24:00:00"),
                            startTime: timeFormat.parse("00:00:00"),
                            endTime: timeFormat.parse(currentTimeArray[1])
                        });
                    } else {
                        newDataObj.push({
                            status: dataValue.status,
                            startDay: dayFormat.parse(nextDay + " 00:00:00"),
                            endDay: dayFormat.parse(endSearchTimeArray[0] + " 24:00:00"),
                            startTime: timeFormat.parse("00:00:00"),
                            endTime: timeFormat.parse("23:59:59")
                        });
                    }
                }
            }

        });

        return newDataObj
    }


    const drawGraph = (currentData) => {

        let startDate = moment(selectedStartDate);
        let endDate = moment(selectedEndDate);
        let clickElement = null;
        let tickInterval = null;
        let labelTextHeight = labelArr.length * 22;
        // graph variables
        let x = null;
        let y = null;
        let xAxis = null;
        let yAxis = null;
        let svg = null;
        // currently height & width is fixed
        let margin = { top: 50 + labelTextHeight, right: 18, bottom: 40, left: 60 },
            width = 800 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        // Create Graph based on given datapoints
        const generate = (id) => {

            x = d3.time.scale()
                .range([0, width]);

            y = d3.time.scale()
                .range([height, 0]);

            let startTime = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse(startDate.format("YYYY-MM-DD HH:mm:ss");
            let endTime = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse(endDate.format("YYYY-MM-DD HH:mm:ss").split(" ").join("T") + "Z");
            let timeOffset = endDate.diff(startDate, 'days');

            if (timeOffset <= 7) {
                tickInterval = 1;
            } else if (timeOffset <= 14) {
                tickInterval = 2;
            } else {
                tickInterval = 4;
            }

            // X Axis
            xAxis = d3.svg.axis()
                .scale(x)
                .tickValues(function () {
                    let tickDateArr = [];
                    let dayNameFormat = d3.time.format("%Y-%m-%dT%H:%M:%SZ");
                    let startDateClone = startDate.clone();

                    do {
                        let tickDate = dayNameFormat.parse(startDateClone.format("YYYY-MM-DD HH:mm:ss").split(" ").join("T") + "Z");
                        tickDateArr.push(tickDate);
                        startDateClone.add(tickInterval, 'd');
                    } while (startDateClone.isSameOrBefore(endDate));
                    return tickDateArr;
                })
                .tickFormat(d3.time.format("%m-%d"))
                .tickSize(-height)
                .outerTickSize(4)
                .tickPadding([6])
                .orient("bottom");

            // Y Axis
            yAxis = d3.svg.axis()
                .scale(y)
                .ticks(d3.time.hours, 2)
                .tickFormat(d3.time.format("%H:%M"))
                .tickSize(-width)
                .outerTickSize(4)
                .tickPadding([6])
                .orient("left");

            let yStartTime = d3.time.format("%H:%M:%S").parse("00:00:00");
            let yEndTime = d3.time.format("%H:%M:%S").parse("23:59:59");

            y.domain([yStartTime, yEndTime]);
            x.domain([startTime, endTime]);

            // remove old svg
            d3.select('#history-graph-svg-disk').remove();

            svg = d3.select(id).append("svg")
                .attr("id", "history-graph-svg-disk")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .style("touch-action", "pan-y")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
                .attr("class", "x axis")
                .attr("id", "history-graph-x-axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("y", 26)
                .attr("x", width / 2)
                .style("text-anchor", "end")
                .text("Time"); // label

            svg.append("g")
                .attr("class", "y axis")
                .attr("id", "history-graph-y-axis")
                .call(yAxis)
                .append("text")
                .attr("x", -15)
                .attr("y", -10)
                .style("text-anchor", "end")
                .text("Time"); // label

        }

        const getOpt = () => {
            let axisOpt = new Object();
            axisOpt['x'] = x;
            axisOpt['y'] = y;
            axisOpt['xAxis'] = xAxis;
            axisOpt['yAxis'] = yAxis;
            axisOpt['width'] = width;
            axisOpt['height'] = height;
            axisOpt['margin'] = margin;

            return axisOpt;
        };

        const getSvg = () => {
            let svgD = new Object();
            svgD['svg'] = svg;

            return svgD;
        };

        const drawArea = (data, dataName, x, y, xAxis, yAxis, margin, width, height, svg) => {
            let eventType = null;
            let mouseOut = function () {
                if (clickElement) {
                    //$(clickElement).tooltip('destroy');
                    d3.selectAll('.tooltip').remove();
                    clickElement.remove();
                    clickElement = null;
                }
            };
            let mouseClick = function (d, eventElement) {
                let mousePosition1 = d3.mouse(eventElement);
                let xCoordinateTime = x.invert(mousePosition1[0]);
                let yCoordinateTime = y.invert(mousePosition1[1]);

                let format = d3.time.format("%Y-%m-%d %H:%M:%S");
                let xTimeStr = format(xCoordinateTime);
                let yTimeStr = format(yCoordinateTime);
                let timePoint = xTimeStr.split(" ")[0] + " " + yTimeStr.split(" ")[1];

                //remove old point and tooltip
                svg.selectAll(".tooltipPoint").remove();
                d3.selectAll('.tooltip').remove();
                svg.append("circle")
                    .attr("class", "tooltipPoint")
                    .attr("cx", function () {
                        return x(xCoordinateTime);
                    })
                    .attr("cy", function () {
                        return y(yCoordinateTime);
                    })
                    .attr("r", "2px")
                    .on("mouseout", mouseOut)
                    .style("fill", "transparent")
                    .style("stroke", "transparent");

                let mainCate = "Running State"; // label
                let timeShow = "Time"; // label
                let mainCateShow = statusNames[d["status"]].name;
                clickElement = svg.select(".tooltipPoint");
                // $(clickElement).tooltip({
                //     'container': 'body',
                //     'placement': 'top',
                //     'title': mainCate + " : " + mainCateShow + "<br/>" + timeShow + " : " + timePoint,
                //     'trigger': 'hover',
                //     'html': true
                // }).tooltip('show');
            };

            svg.selectAll('.openArea')
                .data(data)
                .enter()
                .append("path")
                .attr("d", function (d) { return dragAreaPath(d); })
                .attr("class", "openArea")
                .on("touchend", function () {
                    eventType = d3.event.type;
                })
                .on("click", function (d) {
                    mouseClick(d, this);
                })
                .on("mouseout", function () {
                    if (eventType === "touchend") {
                        mouseOut();
                    }
                })
                .style("fill", function (d) { return statusNames[d["status"]].color; })
                .style("stroke", function (d) { return statusNames[d["status"]].color; });


            function dragAreaPath(data) {
                let dataArray = [];
                dataArray.push({
                    xTime: data["startDay"],
                    yTime: data["startTime"]
                });
                dataArray.push({
                    xTime: data["endDay"],
                    yTime: data["endTime"]
                });
                let dragArea = d3.svg.area()
                    .x(function (d) { return x(d['xTime']); })
                    .y0(function () { return y(data["startTime"]); })
                    .y1(function () { return y(data["endTime"]); });

                return dragArea(dataArray);
            }
        }

        function drawDots(data, dataName, x, y, xAxis, yAxis, margin, width, height, svg) {
            svg.selectAll(".openDot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "openDot")
                .attr("cx", function (d) {
                    return x(d['startDay']);
                })
                .attr("cy", function (d) {
                    return y(d["startTime"]);
                })
                .attr("r", "4px")
                .style("fill", function (d) { return statusNames[d["status"]].color; })
                .style("stroke", function (d) { return statusNames[d["status"]].color; })
                .on("mouseover", function (d) {
                    let format = d3.time.format("%Y-%m-%d %H:%M:%S");
                    let xTimeStr = format(d['startDay']);
                    let yTimeStr = format(d["startTime"]);
                    let timePoint = xTimeStr.split(" ")[0] + " " + yTimeStr.split(" ")[1];
                    let mainCate = "Running State"; // label
                    let timeShow = "Time" // label
                    let mainCateShow = statusNames[d["status"]].name;

                    d3.selectAll('.tooltip').remove();
                    // $(this).tooltip({
                    //     'container': 'body',
                    //     'placement': 'top',
                    //     'title': mainCate + " : " + mainCateShow + "<br/>" + timeShow + " : " + timePoint,
                    //     'trigger': 'hover',
                    //     'html': true
                    // }).tooltip('show');
                })
                .on("mouseout", function () {
                    // $(this).tooltip('destroy');
                    d3.selectAll('.tooltip').remove();
                });
        }

        // Create Graph X & Y Axis Labels
        const drawLabel = (svg, margin, width) => {
            let labRadius = 10;
            let longestString = "";
            let labWidth = 100;
            labelArr.map((label) => {
                if (label.name.length > longestString.length) {
                    longestString = label.name;
                }
            });

            svg.selectAll('.labelCircle')
                .data(labelArr)
                .enter()
                .append("circle")
                .attr("class", "labelCircle")
                .attr("cx", function (d, i) { return width - 12 - labWidth; })
                .attr("cy", function (d, i) { return -margin.right - 22 * (labelArr.length - 1 - i); })
                .attr("r", labRadius)
                .style("fill", function (d) { return d.color; });

            svg.selectAll('.labelText')
                .data(labelArr)
                .enter()
                .append("text")
                .attr("class", "labelText")
                .attr("x", function (d, i) { return width - labWidth; })
                .attr("y", function (d, i) { return -margin.right - 22 * (labelArr.length - 1 - i); })
                .attr("dy", function () { return labRadius / 2; })
                .text(function (d) { return d.name; });
        }

        // Create Graph
        let sca = new generate("#bb-history-widget-graph");
        let svgOpt = getOpt();
        let showWithDots = false
        if (showWithDots) {
            drawDots(currentData, "key", svgOpt['x'], svgOpt['y'], svgOpt['xAxis'], svgOpt['yAxis'], svgOpt['margin'], svgOpt['width'], svgOpt['height'], getSvg()['svg']);
        } else {
            drawArea(currentData, "key", svgOpt['x'], svgOpt['y'], svgOpt['xAxis'], svgOpt['yAxis'], svgOpt['margin'], svgOpt['width'], svgOpt['height'], getSvg()['svg']);
        }

        drawLabel(getSvg()['svg'], svgOpt['margin'], svgOpt['width']);

    }

    return (<div id="bb-history-widget-graph"></div>)
};
export default DeviceHistoryChart;