import React from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import { DateRangePicker } from "react-date-range";

import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInCalendarDays,
} from "date-fns";
import { useState } from "react";

const defineds = {
  startOfWeek: startOfWeek(new Date()),
  endOfWeek: endOfWeek(new Date()),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  startOfTomorrow: startOfDay(addDays(new Date(), +1)),
  endOfTomorrow: endOfDay(addDays(new Date(), +1)),
  startOfNextWeek: startOfWeek(addDays(new Date(), +7)),
  endOfNextWeek: endOfWeek(addDays(new Date(), +7)),
  startOfNextMonth: startOfMonth(addMonths(new Date(), +1)),
  endOfNextMonth: endOfMonth(addMonths(new Date(), +1)),
};

const staticRangeHandler = {
  range: {},
  isSelected(range) {
    const definedRange = this.range();
    return (
      isSameDay(range.startDate, definedRange.startDate) &&
      isSameDay(range.endDate, definedRange.endDate)
    );
  },
};

const createStaticRanges = (ranges) => {
  return ranges.map((range) => ({ ...staticRangeHandler, ...range }));
};

const defaultStaticRanges = createStaticRanges([
  {
    label: "Today",
    range: () => ({
      startDate: defineds.startOfToday,
      endDate: defineds.endOfToday,
    }),
  },

  {
    label: "This Week",
    range: () => ({
      startDate: defineds.startOfWeek,
      endDate: defineds.endOfWeek,
    }),
  },

  {
    label: "This Month",
    range: () => ({
      startDate: defineds.startOfMonth,
      endDate: defineds.endOfMonth,
    }),
  },
]);

const defaultInputRanges = [
  {
    label: "days starting today",
    range(value) {
      const today = new Date();
      return {
        startDate: today,
        endDate: addDays(today, Math.max(Number(value), 1) - 1),
      };
    },
    getCurrentValue(range) {
      if (!isSameDay(range.startDate, defineds.startOfToday)) return "-";
      if (!range.endDate) return "∞";
      return differenceInCalendarDays(range.endDate, defineds.startOfToday) + 1;
    },
  },
];

function DateRangePickerFunction(props) {
  const initialState = {
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  };

  const currentState = {
    selection: {
      startDate: props.SearchValueStartObject,
      endDate: props.SearchValueEndObject,
      key: "selection",
    },
  };

  const [state, setState] =
    props.currentSearchValue == ""
      ? useState(initialState)
      : useState(currentState);

  const sideBar = defaultStaticRanges;

  const staticRanges = [...createStaticRanges(sideBar)];

  const handleSelect = (ranges) => {
    setState({ ...state, ...ranges });
    props.SearchValue(ranges.selection.startDate, ranges.selection.endDate);
    console.log("start Date: ", ranges.selection.startDate);
    console.log("end Date: ", ranges.selection.endDate);
  };

  return (
    <div
      style={{
        boxShadow: "4px 12px 24px 4px rgba(0, 0, 0, 0.15)",
        position: "absolute",
        paddingTop: "10px",
        zIndex: "1700",

        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="modal-content">
        <div className="modal-body">
          <DateRangePicker
            showSelectionPreview={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={[state.selection]}
            //ranges={state}
            staticRanges={staticRanges}
            inputRanges={defaultInputRanges}
            direction="horizontal"
            minDate={addDays(new Date(), -365)}
            //maxDate={addDays(new Date(), 0)}
            //inputRanges={[]}
          />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-default btn-sm"
            data-dismiss="modal"
            onClick={props.onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DateRangePickerFunction;
