export const dateFormatter = new Intl.DateTimeFormat(navigator.language ?? "en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
