import * as moment from 'moment-timezone';

export class AppSettings {

  public static UPLOAD_LIMITS = {
    OneMB:      1048576,
    TwoMB:      2097152,
    FiveMB:     5242880,
    TenMB:      10485760,
    TwentyMB:   20971520,
    HundredMB:  104857600,
  };

  public static TIMEZONE = moment.tz.guess();
  public static CLIENTSETTINGS = 'client_setting';
}
