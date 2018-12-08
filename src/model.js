/*
  model.js

  This file is required. It must export a class with at least one public function called `getData`

  Documentation: http://koopjs.github.io/docs/specs/provider/
*/

const fs = require('fs')
const fetch = require('node-fetch');
const isUrl = require('is-url-superb');
const translate = require('./util/translate-csv')

function Model (koop) {}

// Public function to return data from the
// Return: GeoJSON FeatureCollection
Model.prototype.getData = function (req, callback) {
  const source = process.env.CSV_SOURCE

  if (isUrl(source)) {
    // this is a network URL
    fetch(source)
      .then((res) => res.text())
      .then((content) => {
        const geojson = translate(content)
        callback(null, geojson)
      })
      .catch(err => callback(err))
  } else if (source.endsWith('.csv')) {
    // this is a file path
    fs.readFile(source, 'utf-8', (err, data) => {
      if (err) {
        callback(err)
      } else {
        const geojson = translate(data)
        callback(null, geojson)
      }
    })
  } else {
    callback(new Error(`Unrecognized CSV source ${source}`))
  }
}

module.exports = Model
