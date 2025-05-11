import { AutoUpdateMode } from '../../enums/auto-update-mode';
import { DeveloperSettings } from '../../enums/developer-settings';
import { InstallType } from '../../enums/install-type';
import { LocationMode } from '../../enums/location-mode';
import { PermissionPolicy } from '../../enums/permission-policy';
import { PowerButtonAction } from '../../enums/power-button-action';
import { ScreenBrightnessMode } from '../../enums/screen-brightness-mode';
import { ScreenTimeoutMode } from '../../enums/screen-timeout-mode';
import { UsbDataAccess } from '../../enums/usb-data-access';
import { WifiSsidPolicyType } from '../../enums/wifi-ssid-policy-type';
import { WifiState } from '../../enums/wifi-state';

export interface Policy {
  name: string;
  applicationPolicies: ApplicationPolicy[];
  wifiState?: WifiState;
  wifiSsidPolicy?: WifiSsidPolicy;
  locationMode?: LocationMode;
  bluetoothDisabled?: boolean;
  adjustVolumeDisabled?: boolean;
  powerButtonAction?: PowerButtonAction;
  usbDataAccess?: UsbDataAccess;
  factoryResetDisabled?: boolean;
  installAppsDisabled?: boolean;
  isDefault?: boolean;
  groupIds?: number[];
  developerSettings: DeveloperSettings;
  displaySettings?: DisplaySettings;
  maximumTimeToLock?: number;
}
export interface WifiSsidPolicy {
  wifiSsidPolicyType: WifiSsidPolicyType;
  wifiSsids: string[];
}
export interface ApplicationPolicy {
  packageName: string;
  installType?: InstallType;
  defaultPermissionPolicy?: PermissionPolicy;
  disabled?: boolean;
  autoUpdateMode?: AutoUpdateMode;
}

export interface DisplaySettings {
  screenBrightnessSettings: ScreenBrightnessSettings;
  screenTimeoutSettings: ScreenTimeoutSettings;
}

export interface ScreenBrightnessSettings {
  screenBrightnessMode: ScreenBrightnessMode;
  screenBrightness: number;
}

export interface ScreenTimeoutSettings {
  screenTimeoutMode: ScreenTimeoutMode;
  screenTimeout: number;
}
