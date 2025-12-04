export default class Footer {
  constructor() {
    this.initFooterInfo();
  }

  initFooterInfo() {
    const yearLabel = document.querySelector('[data-info="year-label"]');
    const timestampLive = document.querySelector(
      '[data-info="timestamp-live"]'
    );
    const uptimeData = document.querySelector('[data-info="uptime"]');

    // nom sexy pour "creation__year"
    const label = "sys.init-year";

    const Y = new Date().getFullYear();
    yearLabel.textContent = `${label}:${Y}`;

    let start = Date.now();

    setInterval(() => {
      const now = Date.now();

      // timestamp live
      timestampLive.textContent = `ts:${Math.floor(now / 1000)}`;

      // uptime format HH:MM:SS
      let diff = Math.floor((now - start) / 1000);
      let h = String(Math.floor(diff / 3600)).padStart(2, "0");
      let m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      let s = String(diff % 60).padStart(2, "0");

      uptimeData.textContent = `uptime:${h}:${m}:${s}`;
    }, 1000);
  }
}
