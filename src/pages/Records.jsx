import React, { useEffect, useState } from "react";

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

const resolveApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
};

const buildApiUrl = (path) => {
  const base = resolveApiBaseUrl();
  return base ? `${base}${path}` : path;
};

export default function Records() {
  const [statusRows, setStatusRows] = useState([]);
  const [scheduleRows, setScheduleRows] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const response = await fetch(buildApiUrl("/api/records"));
        if (!response.ok) {
          throw new Error("Failed to load records");
        }
        const data = await response.json();
        setStatusRows(data.requestStatusTable ?? []);
        setScheduleRows(data.requestScheduleTable ?? []);
        setStatus("success");
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    }

    fetchRecords();
  }, []);

  if (status === "loading") {
    return (
      <div
        style={{
          paddingTop: "12px",
          paddingLeft: "12px",
        }}
      >
        Loading records...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        style={{
          paddingTop: "12px",
          paddingLeft: "12px",
        }}
      >
        Failed to load records: {error}
      </div>
    );
  }

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
          {statusRows.map((row) => (
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
          {scheduleRows.map((row) => (
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
