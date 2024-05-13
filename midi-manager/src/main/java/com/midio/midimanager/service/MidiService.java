package com.midio.midimanager.service;

import com.midio.midimanager.exception.ForbiddenException;
import com.midio.midimanager.exception.NotFoundException;
import com.midio.midimanager.model.Blob;
import com.midio.midimanager.model.Midi;
import com.midio.midimanager.model.MidiAndBlob;
import com.midio.midimanager.model.MidiId;
import com.midio.midimanager.model.UserId;
import com.midio.midimanager.repository.MidiMetaRepository;
import com.midio.midimanager.security.CurrentUser;
import com.midio.midimanager.util.MidiValidator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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

    public List<Midi> getMidisByUserId(CurrentUser currentUser) {
        return midiMetaRepository.getMidiMetaByUserId(currentUser.userId());
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
                Optional.of(midiMeta),
                Optional.of(blob)
            );
        }
        logger.warn("Warning: User {} tried to access a file without permission", currentUser.userId());
        throw new ForbiddenException("User does not have access to this midi", currentUser.idToString());
    }

    @Transactional
    public MidiAndBlob createMidi(MidiAndBlob midiAndBlob, CurrentUser currentUser) {
        var metaData = midiAndBlob.metaData().orElseThrow();
        var binaryData = midiAndBlob.blob().orElseThrow();

        MidiValidator.validate(binaryData.midiData());

        midiMetaRepository.saveMidiMeta(metaData);
        blobService.saveBlob(binaryData);

        logger.info("User {} created a new {} midi-file.",
            currentUser.userId(), metaData.isPrivate() ? "private" : "public");

        return getMidiAndBlobById(metaData.midiId(), currentUser);
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

            midiAndBlob.blob().ifPresent(blob -> {
                MidiValidator.validate(blob.midiData());
                var editData = new Blob(blobRef, blob.midiData());

                blobService.updateBlob(editData);
            });
            midiAndBlob.metaData().ifPresent(midiMetaRepository::editMidiMeta);

            return getMidiAndBlobById(midiId, currentUser);
        } else {
            logger.warn("Warning: User {} tried to edit a file without permission", currentUser.userId());
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

            logger.info("User {} deleted a midi-file with id: {}", currentUser.userId(), deleteId.id());
            // TODO: Handle this accordingly
            if (blobService.getBlobById(existingMidi.blobRef()).isPresent()) {
                logger.warn("Warning: Blob file is still present");
            }
            if (midiMetaRepository.getMidiMetaById(deleteId).isPresent()) {
                logger.warn("Warning: Midi meta data is still present");
            }
        } else {
            logger.warn("Warning: User {} tried to delete a file without permission", currentUser.userId());
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
