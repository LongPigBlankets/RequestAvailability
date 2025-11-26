export const requestStatusTable = [
  {
    RequestID: "abc123",
    RequestStatus: "accepted",
    AcceptedBy: "Employee1",
    DateTimeCreated: "16:01 14th of November",
    CancellationStatus: "Live",
    ExpiryDateTime: "16:00 15th of November",
    AcceptedDateTime: "16:49 14th of November",
  },
  {
    RequestID: "abc456",
    RequestStatus: "rejected",
    AcceptedBy: "Employee1",
    DateTimeCreated: "16:06 14th of November",
    CancellationStatus: "Live",
    ExpiryDateTime: "16:05 15th of November",
    AcceptedDateTime: "16:50 14th of November",
  },
  {
    RequestID: "abc789",
    RequestStatus: "accepted",
    AcceptedBy: "Employee1",
    DateTimeCreated: "16:15 14th of November",
    CancellationStatus: "Cancelled",
    ExpiryDateTime: "16:14 15th of November",
    AcceptedDateTime: "Null",
  },
];

export const requestScheduleTable = [
  {
    RequestID: "abc123",
    Venue: "London",
    DatesRequested: [
      "10th of December",
      "11th of December",
      "12th of December",
      "5th of January",
      "6th of January",
    ],
    TimesRequested: ["9:00", "9:00", "9:30", "12:30", "12:30"],
  },
];
