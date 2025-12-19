module.exports = {
  eleventyComputed: {
    permalink: function (data) {
      return `works/${data.work.slugs[0]}/`;
    },
    title: function (data) {
      return `${data.work.data.title[0].text} | Martin CTRL`;
    },
  },
};
