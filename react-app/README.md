# MIDio - Midi Visualization App

## About

This app lets the user load, playback and visualize midi files.
The user can create an account to upload their own midi files and browse a library of public midi files.

This app is built with:
- Typescript
- React
- Redux
- Tone.js
- D3

## Vite

This app uses Vite for building and serving the app.
**For local use locally, run:** `npm start`

## OpenApi

Before running a local instance generation of API is required.
**To generate all midi related files, run:** `openapi-generator-cli generate -i ../midi-manager/src/main/resources/midi-manager-api.yaml -g typescript-fetch -o ./src/generated/midi-api --server-variables=address=localhost:8082`

**To generate all user related files, run:** `openapi-generator-cli generate -i ../user-service/src/main/resources/user-service-api.yaml -g typescript-fetch -o ./src/generated/user-api --server-variables=address=localhost:8081`

..
