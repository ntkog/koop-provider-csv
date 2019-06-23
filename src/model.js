/*
  model.js

  This file is required. It must export a class with at least one public function called `getData`

  Documentation: http://koopjs.github.io/docs/specs/provider/
*/

const koopConfig = require("config");
const fs = require("fs");
const fetch = require("node-fetch");
const {chain}  = require("stream-chain");
const {parser} = require("stream-csv-as-json");
const {asObjects} = require("stream-csv-as-json/AsObjects");
const {streamValues} = require("stream-json/streamers/StreamValues");
// It won't chain, so it not has to be read on each getData call
const CONFIG = koopConfig["koop-provider-csv"];
const GEOJSON_TEMPLATE = {
  type: "FeatureCollection",
  features: [],
  metadata : null
}
const FEATURE_TEMPLATE = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Point",
    coordinates: []
  }
};

function Model(koop) {}

function isUrl (str) {
  return /^http[s]?:\/\//.test(str);
}


// Public function to return data from the
// Return: GeoJSON FeatureCollection
Model.prototype.getData = async function(req, callback) {
  var features = [];

  const sourceConfig = CONFIG.sources[req.params.id];
  const csvOrigin = sourceConfig.url;
  let pipeline = chain([
    parser({ separator: sourceConfig.delimiter || ","}),
    asObjects(),
    streamValues(),
    data => {
      let lat = parseFloat(data.value[sourceConfig.geometryColumns.latitude]);
      let lon = parseFloat(data.value[sourceConfig.geometryColumns.longitude]);
      let properties = {...data.value};
      delete properties[sourceConfig.geometryColumns.latitude];
      delete properties[sourceConfig.geometryColumns.longitude];
      return {
        ...FEATURE_TEMPLATE,
        geometry : {
          type : "Point",
          coordinates : [lon,lat]
        },
        properties: {
          ...properties,
          id : sourceConfig.metadata.hasOwnProperty("idField")
            ? parseInt(data.value[sourceConfig.metadata.idField])
            : data.key+1
        }
      };
    }
  ])

  pipeline
    .on("data", (data) => {
      features.push(data);
    })
    .on("error", (err) => {
      console.error(err)
      callback(err);
    })
    .on("end", () => {
      callback(null, {
        ...GEOJSON_TEMPLATE,
        features : features,
        metadata : sourceConfig.metadata
      });
    });

  let startStream = isUrl(csvOrigin)
      ? await fetch(csvOrigin).then(res => res)
      : fs.createReadStream(`${process.cwd()}/${csvOrigin}`);
  startStream.pipe(pipeline);

};

module.exports = Model;
