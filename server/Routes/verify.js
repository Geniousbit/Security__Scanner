const express = require("express");
const router = express.Router();

const axios = require("axios").default;

// controllers
const dataSharing = require("../Controllers/dataSharing");

router.post("/api/scan", (req, res, next) => {
    try {
      const urlLink = req.body.url;
  
      const { URLSearchParams } = require("url");
      const encodedParams = new URLSearchParams();
  
      encodedParams.set("url", urlLink);
      encodedParams.set("apikey", process.env.KEY);
  
      const options = {
        method: "POST",
        url: "https://www.virustotal.com/vtapi/v2/url/scan",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: encodedParams,
      };
    //   console.log(options);
  
      axios
        .request(options)
        .then(function (response) {
        //   console.log(response.data);
          // obtaining the scan_id and response_code
          const { scan_id, response_code } = response.data;
          // send those data for a get request
          dataSharing(scan_id, response_code, req, res);
        })
        .catch(function (error) {
            // console.log(error);
          res.status(404).json({ msg: "Oops there exist some error1" });
        });
    } catch (err) {
      res.status(404).json({ msg: "Oops there exist some error2" });
    }
  });

module.exports = router;