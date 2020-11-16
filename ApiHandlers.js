const _ = require("lodash");
const axios = require("axios");

const getPing = (req, res) => res.status(200).json({ success: true });

const getPosts = (req, res) => {
  const sortByOptions = ["id", "reads", "likes", "popularity"];
  const directionOptions = ["asc", "desc"];

  const getDatum = async () => {
    const hatchwaysBaseURL = "https://api.hatchways.io/assessment/blog/posts?";
    let datumArr = [];
    let promiseArr = [];
    const sortBy = (await req.query.sortBy) || sortByOptions[0];
    const direction = (await req.query.direction) || directionOptions[0];
    const tags = _.split(req.query.tags, ",");
    for (x in tags) {
      promiseArr.push(
        axios.get(hatchwaysBaseURL + "tag=" + tags[x]).then((response) => {
          datumArr = _.concat(datumArr, response.data.posts);
        })
      );
    }
    Promise.all(promiseArr)
      .then(
        () =>
          (datumArr =
            direction === "asc"
              ? _.sortBy(_.uniqBy(datumArr, "id"), [sortBy])
              : _.reverse(_.sortBy(_.uniqBy(datumArr, "id"), [sortBy])))
      )
      .then(() => res.status(200).json({ posts: datumArr }))
      .catch((err) => console.log(err));
  };

  const isValidQuery = () => {
    const inOptions = (optionSet, value) => _.includes(optionSet, value);
    if (req.query.tags === undefined) {
      res.status(400).json({ error: "Tags parameter is required" });
    } else if (
      req.query.sortBy !== undefined &&
      !inOptions(sortByOptions, req.query.sortBy)
    ) {
      res.status(400).json({ error: "sortBy parameter is invalid" });
    } else if (
      req.query.direction !== undefined &&
      !inOptions(directionOptions, req.query.direction)
    ) {
      res.status(400).json({ error: "direction parameter is invalid" });
    } else {
      return true;
    }
  };
  if (isValidQuery()) {
    getDatum();
  }
};

module.exports = { getPing, getPosts };
