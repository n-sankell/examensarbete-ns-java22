package com.example.midimanager.service;

import com.example.midimanager.exception.NotFoundException;
import com.example.midimanager.exception.ForbiddenException;
import com.example.midimanager.model.Blob;
import com.example.midimanager.model.Midi;
import com.example.midimanager.model.MidiAndBlob;
import com.example.midimanager.repository.MidiMetaRepository;
import com.example.midimanager.secirity.CurrentUser;
import com.example.midimanager.util.MidiValidator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

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

    public List<Midi> getMidisByUserId(UUID userId, CurrentUser currentUser) {
        // TODO: even public midis does not show because the user has to be authenticated to call the endpoint
        if (userId.equals(currentUser.userId())) {
            return midiMetaRepository.getMidiMetaByUserId(userId);
        }
        throw new ForbiddenException("The requested files does not belong to the current user.");
    }

    public MidiAndBlob getMidiAndBlobById(UUID midiId, CurrentUser currentUser) {
        // TODO: check returns forbidden even if the user is unauthenticated
        //  because getMIdiById endpoint is accepting all connections
        var midiMeta = midiMetaRepository.getMidiMetaById(midiId)
            .orElseThrow(NotFoundException::new);
        var userRef = midiMeta.userRef();
        if (!midiMeta.isPrivate() || hasPrivateAccess(currentUser, userRef)) {
            var blobRef = midiMeta.blobRef();
            var blob = blobService.getBlobById(blobRef)
                .orElseThrow(NotFoundException::new);
            return new MidiAndBlob(
                midiMeta,
                blob
            );
        }
        throw new ForbiddenException("User does not have access to this midi");
    }

    @Transactional
    public MidiAndBlob createMidi(MidiAndBlob midiAndBlob, CurrentUser currentUser) {
        MidiValidator.validate(midiAndBlob.blob().midiData());

        midiMetaRepository.saveMidiMeta(midiAndBlob.metaData());
        blobService.saveBlob(midiAndBlob.blob());

        return getMidiAndBlobById(midiAndBlob.metaData().midiId(), currentUser);
    }

    @Transactional
    public MidiAndBlob updateMidi(UUID midiId, MidiAndBlob midiAndBlob, CurrentUser currentUser) {
        // TODO: Add check if the current user owns the file,
        //  only the owner will be allowed to edit files, even public ones
        var existingMidi = midiMetaRepository.getMidiMetaById(midiId)
            .orElseThrow(NotFoundException::new);

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
    }

    @Transactional
    public void deleteMidi(UUID deleteId, CurrentUser currentUser) {
        var existingMidi = midiMetaRepository.getMidiMetaById(deleteId)
            .orElseThrow(NotFoundException::new);

        blobService.deleteBlob(existingMidi.blobRef());
        midiMetaRepository.deleteMidiMetaById(deleteId);

        // TODO: Handle this accordingly
        if (blobService.getBlobById(existingMidi.blobRef()).isPresent()) {
            logger.warn("Warning: Blob file is still present");
        }
        if (midiMetaRepository.getMidiMetaById(deleteId).isPresent()) {
            logger.warn("Warning: Midi meta data is still present");
        }
    }

    private boolean hasPrivateAccess(CurrentUser currentUser, UUID midiUserRef) {
        return currentUser.isAuthenticated() && currentUser.userId().equals(midiUserRef);
    }

    private Logger getLogger() {
        return LogManager.getLogger(this.getClass());
    }

}
