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


export const formatDateWithTime = (date: Date | string) => {
  const parsedDate = new Date(date)
  const now = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  if (
    parsedDate.getDate() === now.getDate() &&
    parsedDate.getMonth() === now.getMonth() &&
    parsedDate.getFullYear() === now.getFullYear()
  ) {
    return `Today, ${formatTime(parsedDate)}`
  } else if (
    parsedDate.getDate() === yesterday.getDate() &&
    parsedDate.getMonth() === yesterday.getMonth() &&
    parsedDate.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday, ${formatTime(parsedDate)}`
  } else {
    return parsedDate.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
}