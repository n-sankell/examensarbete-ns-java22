package com.example.midimanager.controller;

import com.example.midimanager.model.MidiId;
import com.example.midimanager.model.UserId;
import com.example.midimanager.secirity.CurrentUser;
import com.example.midimanager.secirity.CurrentUserSupplier;
import com.example.midimanager.service.MidiService;
import generatedapi.MidisApi;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiEditBinaryRequestDto;
import generatedapi.model.MidiEditMetaRequestDto;
import generatedapi.model.MidiEditRequestDto;
import generatedapi.model.MidiWithDataDto;
import generatedapi.model.MidisDto;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import static com.example.midimanager.converter.MidiConverter.*;
import static org.springframework.http.ResponseEntity.ok;

@RestController
public class MidiController implements MidisApi {

    private final MidiService midiService;
    private final CurrentUserSupplier currentUserSupplier;

    @Autowired
    public MidiController(MidiService midiService, CurrentUserSupplier currentUserSupplier) {
        this.midiService = midiService;
        this.currentUserSupplier = currentUserSupplier;
    }

    @Override
    public ResponseEntity<MidisDto> getPublicMidis() {
        return ok(convert(midiService.getPublicMidis()));
    }

    @Override
    public ResponseEntity<MidiWithDataDto> getMidi(UUID id) {
        var midiId = new MidiId(id);
        return ok(convert(midiService.getMidiAndBlobById(midiId, getCurrentUser())));
    }

    @Override
    public ResponseEntity<MidisDto> getUserMidis(UUID id) {
        var userId = new UserId(id);
        return ok(convert(midiService.getMidisByUserId(userId, getCurrentUser())));
    }

    @Override
    public ResponseEntity<MidiWithDataDto> createMidi(MidiCreateRequestDto midiCreateData) {
        var currentUser = getCurrentUser();
        var midiAndData = buildCreateData(midiCreateData, currentUser.userId());
        return ok(convert(midiService.createMidi(midiAndData, currentUser)));
    }

    @Override
    public ResponseEntity<MidiWithDataDto> editMidi(UUID id, MidiEditRequestDto editDataDto) {
        var midiId = new MidiId(id);
        var editData = buildEditData(editDataDto, midiId);
        return ok(convert(midiService.updateMidi(midiId, editData, getCurrentUser())));
    }

    @Override
    public ResponseEntity<MidiWithDataDto> editMidiBinary(UUID id, MidiEditBinaryRequestDto editDataDto) {
        var midiId = new MidiId(id);
        var editData = buildEditData(editDataDto, midiId);
        return ok(convert(midiService.updateMidi(midiId, editData, getCurrentUser())));
    }

    @Override
    public ResponseEntity<MidiWithDataDto> editMidiMeta(UUID id, MidiEditMetaRequestDto editDataDto) {
        var midiId = new MidiId(id);
        var editData = buildEditData(editDataDto, midiId);
        return ok(convert(midiService.updateMidi(midiId, editData, getCurrentUser())));
    }

    @Override
    public ResponseEntity<Object> deleteMidi(UUID id) {
        var midiId = new MidiId(id);
        midiService.deleteMidi(midiId, getCurrentUser());
        return ok("Deleted");
    }

    private CurrentUser getCurrentUser() {
        return currentUserSupplier.getCurrentUser();
    }

}
