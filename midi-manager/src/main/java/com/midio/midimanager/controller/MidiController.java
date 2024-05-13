package com.midio.midimanager.controller;

import com.midio.midimanager.model.MidiId;
import com.midio.midimanager.security.CurrentUser;
import com.midio.midimanager.security.CurrentUserSupplier;
import com.midio.midimanager.service.MidiService;
import com.midio.midimanager.util.RequestValidator;
import generatedapi.MidisApi;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiDto;
import generatedapi.model.MidiEditRequestDto;
import generatedapi.model.MidiMessageResponseDto;
import generatedapi.model.MidiWithDataDto;
import generatedapi.model.MidisDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;
import java.util.stream.Collectors;

import static com.midio.midimanager.converter.MidiConverter.buildCreateData;
import static com.midio.midimanager.converter.MidiConverter.buildEditData;
import static com.midio.midimanager.converter.MidiConverter.convert;
import static org.springframework.http.ResponseEntity.ok;

@RestController
public class MidiController implements MidisApi {

    private final MidiService midiService;
    private final CurrentUserSupplier currentUserSupplier;
    private final RequestValidator validator;

    @Autowired
    public MidiController(
        MidiService midiService,
        CurrentUserSupplier currentUserSupplier,
        RequestValidator validator
    ) {
        this.midiService = midiService;
        this.currentUserSupplier = currentUserSupplier;
        this.validator = validator;
    }

    @Override
    public ResponseEntity<MidisDto> getPublicMidis() {
        var currentUser = getCurrentUser();
        var publicMidis = convert(midiService.getPublicMidis());
        if (currentUser.isAuthenticated()) {
            var userMidis = convert(midiService.getMidisByUserId(currentUser)).getMidis().stream()
                .map(MidiDto::getMidiId).collect(Collectors.toSet());
            publicMidis.getMidis().forEach(midiDto -> midiDto.userMidi(userMidis.contains(midiDto.getMidiId())));
        }
        return ok(publicMidis);
    }

    @Override
    public ResponseEntity<MidiWithDataDto> getMidi(UUID id) {
        var currentUser = getCurrentUser();
        var midiAndBlob = midiService.getMidiAndBlobById(midiId(id), currentUser);
        var apiMidi = convert(midiAndBlob);

        if (currentUser.isAuthenticated() && midiAndBlob.metaData().orElseThrow().userRef().equals(currentUser.userId())) {
            apiMidi.getMeta().userMidi(true);
        }
        return ok(apiMidi);
    }

    @Override
    public ResponseEntity<MidisDto> getUserMidis() {
        var userMidis = convert(midiService.getMidisByUserId(getCurrentUser()));
        userMidis.getMidis().forEach(midiDto -> midiDto.userMidi(true));
        return ok(userMidis);
    }

    @Override
    public ResponseEntity<MidiWithDataDto> createMidi(MidiCreateRequestDto midiCreateData) {
        validator.validateRequest(midiCreateData);
        var currentUser = getCurrentUser();
        var midiAndData = buildCreateData(midiCreateData, currentUser.userId());
        var createdMidi = convert(midiService.createMidi(midiAndData, currentUser));
        createdMidi.getMeta().userMidi(true);
        return ok(createdMidi);
    }

    @Override
    public ResponseEntity<MidiWithDataDto> editMidi(UUID id, MidiEditRequestDto editDataDto) {
        var midiId = midiId(id);
        validator.validateRequest(editDataDto);
        var editData = buildEditData(editDataDto, midiId);
        var updatedMidi = convert(midiService.updateMidi(midiId, editData, getCurrentUser()));
        updatedMidi.getMeta().userMidi(true);
        return ok(updatedMidi);
    }

    @Override
    public ResponseEntity<MidiMessageResponseDto> deleteMidi(UUID id) {
        midiService.deleteMidi(midiId(id), getCurrentUser());
        return ok().body(new MidiMessageResponseDto().message("Midi deleted"));
    }

    private MidiId midiId(UUID id) {
        return new MidiId(id);
    }

    private CurrentUser getCurrentUser() {
        return currentUserSupplier.getCurrentUser();
    }

}
