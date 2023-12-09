import { APP_NAME } from "@/appConstants";

export function isInitialSetupDone(): boolean {
  const isSetupCompleted = localStorage.getItem(APP_NAME + "__initialSetupCompleted");
  return isSetupCompleted === "true";
}
