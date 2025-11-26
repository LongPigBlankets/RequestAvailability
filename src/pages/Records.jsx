import React from "react";
import {
  requestStatusTable,
  requestScheduleTable,
} from "../data/requestRecords";

const tableHeaders = {
  status: [
    "RequestID",
    "RequestStatus",
    "AcceptedBy",
    "DateTimeCreated",
    "CancellationStatus",
    "ExpiryDateTime",
    "AcceptedDateTime",
  ],
  schedule: ["RequestID", "Venue", "DatesRequested", "TimesRequested"],
};

const formatValue = (value) => {
  if (Array.isArray(value)) {
    return `[${value.join(", ")}]`;
  }
  if (value === null || value === undefined || value === "Null") {
    return "Null";
  }
  return value;
};

export default function Records() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        paddingTop: "12px",
        paddingLeft: "12px",
      }}
    >
      <table>
        <thead>
          <tr>
            {tableHeaders.status.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requestStatusTable.map((row) => (
            <tr key={row.RequestID}>
              {tableHeaders.status.map((field) => (
                <td key={`${row.RequestID}-${field}`}>
                  {formatValue(row[field])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            {tableHeaders.schedule.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requestScheduleTable.map((row) => (
            <tr key={row.RequestID}>
              {tableHeaders.schedule.map((field) => (
                <td key={`${row.RequestID}-${field}`}>
                  {formatValue(row[field])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
