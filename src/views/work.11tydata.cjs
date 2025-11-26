module.exports = {
  eleventyComputed: {
    permalink: function (data) {
      return `works/${data.work.slugs[0]}/`;
    },
  },
};
