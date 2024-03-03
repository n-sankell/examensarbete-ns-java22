package com.example.midimanager.service;

import com.example.midimanager.exception.ForbiddenException;
import com.example.midimanager.exception.NotFoundException;
import com.example.midimanager.model.Blob;
import com.example.midimanager.model.Midi;
import com.example.midimanager.model.MidiAndBlob;
import com.example.midimanager.model.MidiId;
import com.example.midimanager.model.UserId;
import com.example.midimanager.repository.MidiMetaRepository;
import com.example.midimanager.secirity.CurrentUser;
import com.example.midimanager.util.MidiValidator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MidiService {

    private final MidiMetaRepository midiMetaRepository;
    private final BlobService blobService;
    private final Logger logger;

    @Autowired
    public MidiService(MidiMetaRepository midiMetaRepository, BlobService blobService) {
        this.midiMetaRepository = midiMetaRepository;
        this.blobService = blobService;
        this.logger = getLogger();
    }

    public List<Midi> getPublicMidis() {
        return midiMetaRepository.getPublicMidiMeta();
    }

    public List<Midi> getMidisByUserId(UserId userId, CurrentUser currentUser) {
        // TODO: even public midis does not show because the user has to be authenticated to call the endpoint
        if (userId.id().equals(currentUser.userId().id())) {
            return midiMetaRepository.getMidiMetaByUserId(userId);
        }
        throw new ForbiddenException("The requested files does not belong to the user.", currentUser.idToString());
    }

    public MidiAndBlob getMidiAndBlobById(MidiId midiId, CurrentUser currentUser) {
        // TODO: check returns forbidden even if the user is unauthenticated
        //  because getMIdiById endpoint is accepting all connections
        var midiMeta = midiMetaRepository.getMidiMetaById(midiId)
            .orElseThrow(NotFoundException::new);
        var userRef = midiMeta.userRef();
        if (!midiMeta.isPrivate() || hasPrivateReadAccess(currentUser, userRef)) {
            var blobRef = midiMeta.blobRef();
            var blob = blobService.getBlobById(blobRef)
                .orElseThrow(NotFoundException::new);
            return new MidiAndBlob(
                midiMeta,
                blob
            );
        }
        throw new ForbiddenException("User does not have access to this midi", currentUser.idToString());
    }

    @Transactional
    public MidiAndBlob createMidi(MidiAndBlob midiAndBlob, CurrentUser currentUser) {
        MidiValidator.validate(midiAndBlob.blob().midiData());

        midiMetaRepository.saveMidiMeta(midiAndBlob.metaData());
        blobService.saveBlob(midiAndBlob.blob());

        return getMidiAndBlobById(midiAndBlob.metaData().midiId(), currentUser);
    }

    @Transactional
    public MidiAndBlob updateMidi(MidiId midiId, MidiAndBlob midiAndBlob, CurrentUser currentUser) {
        var existingMidi = midiMetaRepository.getMidiMetaById(midiId)
            .orElseThrow(NotFoundException::new);
        var userRef = existingMidi.userRef();

        if (hasEditAccess(currentUser, userRef)) {
            var blobRef = existingMidi.blobRef();
            blobService.getBlobById(blobRef)
                .orElseThrow(NotFoundException::new);

            if (midiAndBlob.blob() != null) {
                MidiValidator.validate(midiAndBlob.blob().midiData());
                var editData = new Blob(blobRef, midiAndBlob.blob().midiData());

                blobService.updateBlob(editData);
            }
            if (midiAndBlob.metaData() != null) {
                midiMetaRepository.editMidiMeta(midiAndBlob.metaData());
            }
            return getMidiAndBlobById(midiId, currentUser);
        } else {
            logger.warn("Warning: User " + currentUser.userId() + " tried to edit a file without permission");
            throw new ForbiddenException("The current user has no edit rights to this file", currentUser.idToString());
        }
    }

    @Transactional
    public void deleteMidi(MidiId deleteId, CurrentUser currentUser) {
        var existingMidi = midiMetaRepository.getMidiMetaById(deleteId)
            .orElseThrow(NotFoundException::new);
        var userRef = existingMidi.userRef();

        if (hasEditAccess(currentUser, userRef)) {
            blobService.deleteBlob(existingMidi.blobRef());
            midiMetaRepository.deleteMidiMetaById(deleteId);

            // TODO: Handle this accordingly
            if (blobService.getBlobById(existingMidi.blobRef()).isPresent()) {
                logger.warn("Warning: Blob file is still present");
            }
            if (midiMetaRepository.getMidiMetaById(deleteId).isPresent()) {
                logger.warn("Warning: Midi meta data is still present");
            }
        } else {
            logger.warn("Warning: User " + currentUser.userId() + " tried to delete a file without permission");
            throw new ForbiddenException("The current user has no right to delete this file", currentUser.idToString());
        }
    }

    private boolean hasPrivateReadAccess(CurrentUser currentUser, UserId midiUserRef) {
        return currentUser.isAuthenticated() && currentUser.userId().id().equals(midiUserRef.id());
    }

    private boolean hasEditAccess(CurrentUser currentUser, UserId midiUserRef) {
        return currentUser.isAuthenticated() && currentUser.userId().id().equals(midiUserRef.id());
    }

    private Logger getLogger() {
        return LogManager.getLogger(this.getClass());
    }

}
