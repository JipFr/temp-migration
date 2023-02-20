function getMigrationDate(): Date {
  const key = "mw-migration-date"
  const item = localStorage.getItem(key);
  if (!item) {
    const currentDate = new Date();
    localStorage.setItem(key, currentDate.toISOString());
    return currentDate;
  }
  return new Date(item);
}

function buildDataObject(): Record<string, any> {
  const out: Record<string, any> = {};

  const bookmarks = localStorage.getItem("mw-bookmarks");
  if (bookmarks) out.bookmarks = JSON.parse(bookmarks);

  const videoProgress = localStorage.getItem("video-progress");
  if (videoProgress) out.videoProgress = JSON.parse(videoProgress);

  return out;
}

export function initialize() {
  // building parameters
  console.log("Running migration...")
  const date = getMigrationDate();
  const data = buildDataObject();

  // setting link
  console.log("Got all data, emitting event to parent");
  document.body.classList.add("loaded")

  // redirecting
  window.parent.postMessage(({
    date,
    data,
    isMigrationData: true
  }), "https://movie-web.app")
}
