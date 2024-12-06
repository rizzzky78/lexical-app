interface DateFormatterConfig {
  locale?: string;
}

const DEFAULT_CONFIG: DateFormatterConfig = {
  locale: "en-US",
};

class DateTimeFormatter {
  private readonly formatter: Intl.DateTimeFormat;

  constructor(config: DateFormatterConfig = DEFAULT_CONFIG) {
    const { locale = DEFAULT_CONFIG.locale } = config;

    this.formatter = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  format(date: Date): string {
    const parts = this.formatter.formatToParts(date);
    let output = "";

    parts.forEach(({ type, value }) => {
      switch (type) {
        case "month":
          output += value + " ";
          break;
        case "day":
          output += value + " ";
          break;
        case "year":
          output += value + ", ";
          break;
        case "hour":
          output += value;
          break;
        case "minute":
          output += ":" + value;
          break;
        case "dayPeriod":
          output += value;
          break;
      }
    });

    return output;
  }
}

export const timestampDate = new DateTimeFormatter();
