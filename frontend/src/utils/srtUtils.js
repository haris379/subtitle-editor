export const srtTimeToSeconds = (time) => {
  const parts = time.split(":").map(Number);

  if (
    parts.length !== 3 ||
    parts.some((part) => !Number.isFinite(part) || part < 0)
  ) {
    return null;
  }

  const [hours, minutes, seconds] = parts;

  if (minutes >= 60 || seconds >= 60) {
    return null;
  }

  return hours * 3600 + minutes * 60 + seconds;
};
export const parseSRT = (srtText) => {
  const blocks = srtText.replace("/\r\n/g", "\n").split("\n\n");
  return blocks
    .map((block) => {
      const lines = block.split("\n");
      if (lines.length < 3) return null;

      const id = lines[0].trim();
      const timeline = lines[1];
      const text = lines.slice(2).join("\n").trim();

      const match = timeline.match(
        /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/,
      );
      if (!match) return null;

      return {
        id,
        startTime: srtTimeToSeconds(match[1]),
        endTime: srtTimeToSeconds(match[2]),
        text,
      };
    })
    .filter(Boolean);
};
