const axios = require("axios").default;

const makeCall = async (scan_id, response_code, req, res) => {
  var result;
  const options = {
    method: "GET",
    url: `https://www.virustotal.com/vtapi/v2/url/report?apikey=${process.env.KEY}&resource=${scan_id}&allinfo=false&scan=${response_code}`,
    headers: { Accept: "application/json" },
  };

  axios
    .request(options)
    .then(async function (response) {
      //   console.log(response.data);
      result = response.data;
    //   console.log(result)
      const data = await Object.entries(result.scans)
    //   console.log(data);
      res.status(200).json({data });
    })
    .catch(function (error) {
        console.log(error);
      res.status(404).json({ msg: "Oops there exist some error" });
    });
};

module.exports = makeCall;
