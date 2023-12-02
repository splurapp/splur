import { APP_NAME } from "@/appConstants";

export function isInitialSetupDone(): boolean {
  const isSetupCompleted = localStorage.getItem(APP_NAME + "__initialSetupCompleted");
  if (isSetupCompleted) {
    return JSON.parse(isSetupCompleted) as boolean;
  }

  return false;
}
