# Examensarbete Niklas Sankell - Java22

## MIDio - Midi Visualization App

### About

This project is a we based app that lets the user load midi files.
The user can playback the file and visualize the notes for piano practicing. 

The system is built with TypeScript and React Redux with the libraries D3 and Tone.js for midi playback and visualizing. 
Backend is built with Java SpringBoot and Gradle and is split up between a user and midi service that handles CRUD operations and persisting data.

**To run a local test environment in Docker, run:** `docker-compose -f docker-compose.test.yaml up -d --build`

Futher updates coming...
