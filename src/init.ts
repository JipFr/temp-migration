import pako from "pako" 

const newDomainUrl = "https://movie-web.app/v2-migration";

function toBinary(arr: Uint8Array) {
  let result = "";
  arr.forEach((char) => {
    result += String.fromCharCode(char);
  });
  return result;
}

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
  const url = new URL(newDomainUrl);
  
  // building parameters
  console.log("Running migration...")
  const date = getMigrationDate();
  url.searchParams.append("m-time", date.toISOString());
  const data = buildDataObject();
  url.searchParams.append("m-data", btoa(toBinary(pako.deflate(JSON.stringify(data)))));

  // setting link
  console.log("built data, redirecting!");
  const textUrl = url.toString();
  document.getElementById("link")?.setAttribute("href", textUrl);
  document.body.classList.add("loaded")

  // redirecting
  window.location.href = textUrl;
}
