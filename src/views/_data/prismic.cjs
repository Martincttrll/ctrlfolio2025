require("dotenv").config();
const prismic = require("@prismicio/client");

const PRISMIC_REPO = process.env.PRISMIC_REPOSITORY;
const client = prismic.createClient(PRISMIC_REPO);

async function fetchWorks() {
  const { results } = await client.getByType("works");

  results.forEach((work) => {
    work.data.descriptionHtml = prismic.asHTML(work.data.description);
  });

  return results;
}
async function fetchExperiments() {
  const { results } = await client.getByType("experiments");
  return results;
}

function extractAssetsFromData(data) {
  const urls = [];

  function scan(obj) {
    if (!obj) return;

    if (Array.isArray(obj)) {
      obj.forEach(scan);
    } else if (typeof obj === "object") {
      for (const key in obj) {
        const value = obj[key];
        if (value && typeof value === "object" && value.url) {
          urls.push(value.url);
        } else {
          scan(value);
        }
      }
    }
  }

  scan(data);
  return urls;
}

async function fetchPrismicData() {
  const works = await fetchWorks();
  const experiments = await fetchExperiments();
  return {
    works,
    experiments,
  };
}
module.exports = fetchPrismicData;
