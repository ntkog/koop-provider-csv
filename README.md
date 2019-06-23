# koop-provider-csv-ntkog



## Additional Features

- Better support for NodeJS streams
- Improved Performance
- proper handling of base filepath (from **process.cwd()**) for local files
- proper parsing for geographic fields (**csv-reader** fails in some cases)
- Refactored


## Installation

with npm

```bash
npm install ntkog/koop-provider-csv
```

with [Koop CLI](https://github.com/koopjs/koop-cli) for your Koop app

`bash koop add koop-provider-csv-ntkog`

## Usage

Once installed, this provider enables routes like

```
/koop-provider-csv/:id/FeatureServer/*
```

where `id` is the unique ID for a source CSV defined in the configuration file.

For example, this route allows to query a CSV file with ID `my-csv`:

```
/koop-provider-csv/my-csv/FeatureServer/0/query
```

## Configuration

This provider is configured with [config](https://github.com/lorenwest/node-config) and all configuration files are in the `config` directory.

A configuration looks like this:

```javascript
{
  // configuration namespace for this provider plugin
  "koop-provider-csv": {
    // define one or multiple CSV sources
    "sources": {
      // a unique ID for each source, which is used in the query route
      "my-data": {
        // [required] a file path or a URL for the source CSV.
        // Path is relative to process.cwd() .
        "url": "path_to_csv",
        // [required] point coordinate columns
        "geometryColumns": {
          "longitude": "longitude_column_name",
          "latitude": "latitude_column_name"
        },
        // [optional] delimiter character
        "delimiter": ",",
        // [optional] ArcGIS service metadata
        "metadata": {
          "idField": "id_column_name"
        }
      }
    }
  }
}

```

See `config/example.json` for a full example.

## Development

### Run dev server

```bash
$ npm start
```

A dev server will be running at `http://localhost:8080`. By default, it will use with `NODE_ENV=dev` and the dev configuration `config/dev.json` should be created beforehand.

### Run tests

```bash
$ npm test
```

## License

MIT
