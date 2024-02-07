package com.example.springbootapp.controller;

import com.example.springbootapp.model.Blob;
import com.example.springbootapp.model.Midi;
import com.example.springbootapp.model.MidiAndBlob;
import com.example.springbootapp.service.BlobService;
import com.example.springbootapp.service.MidiService;
import generatedapi.MidiApi;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiWithDataDto;
import generatedapi.model.MidisDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

import static com.example.springbootapp.converter.MidiConverter.convert;
import static org.springframework.http.ResponseEntity.ok;

@RestController
public class MidiController implements MidiApi {

    private final BlobService blobService;
    private final MidiService midiService;

    @Autowired
    public MidiController(BlobService blobService, MidiService midiService) {
        this.blobService = blobService;
        this.midiService = midiService;
    }

    @GetMapping("/blob")
    public ResponseEntity<Blob> getBlobByIdX() {
        return ok(blobService.getBlobById(UUID.fromString("860e9511-e29b-81d5-a716-846655420002")));
    }

    @GetMapping("/m")
    public ResponseEntity<MidiWithDataDto> getMidiByIdX() {
        return ok(convert(midiService.getMidiAndBlobById(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"))));
    }

    @GetMapping("/u")
    public ResponseEntity<String> updateMidiByIdX() {
        midiService.updateMidiById(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"));
        return ok("Updated!");
    }

    @GetMapping("/blobs")
    public ResponseEntity<List<Blob>> getBlobsX() {
        return ok(blobService.getBlobs());
    }

    @Override
    public ResponseEntity<MidiWithDataDto> createMidi(MidiCreateRequestDto midiCreateData) {
        var midiAndData = buildCreateData(midiCreateData);
        return ok(convert(midiService.createMidi(midiAndData)));
    }

    @Override
    public ResponseEntity<String> deleteMidi(UUID id) {
        midiService.deleteMidi(id);
        return ok("Deleted");
    }

    @Override
    public ResponseEntity<MidiWithDataDto> editMidi(UUID id, MidiWithDataDto midiWithDataDto) {
        return null;
    }

    @Override
    public ResponseEntity<MidiWithDataDto> getMidi(UUID id) {
        return ok(convert(midiService.getMidiAndBlobById(id)));
    }

    @Override
    public ResponseEntity<MidisDto> getMidis() {
        return ok(convert(midiService.getMidis()));
    }

    private MidiAndBlob buildCreateData(MidiCreateRequestDto createData) {
        var blobId = UUID.randomUUID();
        return new MidiAndBlob(
            new Midi(
                UUID.randomUUID(),
                blobId,
                createData.getUserId(),
                createData.getIsPrivate(),
                createData.getFilename(),
                createData.getArtist(),
                createData.getTitle(),
                ZonedDateTime.now(),
                ZonedDateTime.now()
            ),
            new Blob(
                blobId,
                convert(createData.getMidiFile()))
        );
    }

}
