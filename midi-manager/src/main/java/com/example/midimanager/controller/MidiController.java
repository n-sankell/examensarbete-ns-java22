package com.example.midimanager.controller;

import com.example.midimanager.service.MidiService;
import generatedapi.MidiApi;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiEditBinaryRequestDto;
import generatedapi.model.MidiEditMetaRequestDto;
import generatedapi.model.MidiEditRequestDto;
import generatedapi.model.MidiWithDataDto;
import generatedapi.model.MidisDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import static com.example.midimanager.converter.MidiConverter.*;
import static org.springframework.http.ResponseEntity.ok;

@RestController
public class MidiController implements MidiApi {

    private final MidiService midiService;

    @Autowired
    public MidiController(MidiService midiService) {
        this.midiService = midiService;
    }

    @Override
    public ResponseEntity<MidisDto> getPublicMidis() {
        return ok(convert(midiService.getPublicMidis()));
    }

    @Override
    public ResponseEntity<MidiWithDataDto> getMidi(UUID id) {
        return ok(convert(midiService.getMidiAndBlobById(id)));
    }

    @Override
    public ResponseEntity<MidisDto> getUserMidis(UUID id) {
        return ok(convert(midiService.getMidisByUserId(id)));
    }

    @Override
    public ResponseEntity<MidiWithDataDto> createMidi(MidiCreateRequestDto midiCreateData) {
        var midiAndData = buildCreateData(midiCreateData);
        return ok(convert(midiService.createMidi(midiAndData)));
    }

    @Override
    public ResponseEntity<MidiWithDataDto> editMidi(UUID id, MidiEditRequestDto editDataDto) {
        var editData = buildEditData(editDataDto, id);
        return ok(convert(midiService.updateMidi(id, editData)));
    }

    @Override
    public ResponseEntity<MidiWithDataDto> editMidiBinary(UUID id, MidiEditBinaryRequestDto editDataDto) {
        var editData = buildEditData(editDataDto, id);
        return ok(convert(midiService.updateMidi(id, editData)));
    }

    @Override
    public ResponseEntity<MidiWithDataDto> editMidiMeta(UUID id, MidiEditMetaRequestDto editDataDto) {
        var editData = buildEditData(editDataDto, id);
        return ok(convert(midiService.updateMidi(id, editData)));
    }

    @Override
    public ResponseEntity<String> deleteMidi(UUID id) {
        midiService.deleteMidi(id);
        return ok("Deleted");
    }

}
