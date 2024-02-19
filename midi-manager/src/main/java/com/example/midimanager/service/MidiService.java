package com.example.midimanager.service;

import com.example.midimanager.exception.NotFoundException;
import com.example.midimanager.exception.ValidationException;
import com.example.midimanager.model.Midi;
import com.example.midimanager.model.MidiAndBlob;
import com.example.midimanager.repository.MidiMetaRepository;
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

    public List<Midi> getMidisByUserId(UUID userId) {
        // TODO: Add check that the current user is the same as the owner of the midis

        return midiMetaRepository.getMidiMetaByUserId(userId);
    }

    public MidiAndBlob getMidiAndBlobById(UUID midiId) {
        // TODO: add check if the file is private and compare to current user id
        var midiMeta = midiMetaRepository.getMidiMetaById(midiId)
            .orElseThrow(NotFoundException::new);
        var blobRef = midiMeta.blobRef();
        var blob = blobService.getBlobById(blobRef)
            .orElseThrow(NotFoundException::new);
        return new MidiAndBlob(
            midiMeta,
            blob
        );
    }

    @Transactional
    public MidiAndBlob createMidi(MidiAndBlob midiAndBlob) {
        MidiValidator.validate(midiAndBlob.blob().midiData());

        midiMetaRepository.saveMidiMeta(midiAndBlob.metaData());
        blobService.saveBlob(midiAndBlob.blob());

        return getMidiAndBlobById(midiAndBlob.metaData().midiId());
    }

    @Transactional
    public MidiAndBlob updateMidi(UUID midiId, MidiAndBlob midiAndBlob) {
        // TODO: Add check if the current user owns the file,
        //  only the owner will be allowed to edit files, even public ones
        //  Add check if meta or blob data is present
        var existingMidi = midiMetaRepository.getMidiMetaById(midiId)
            .orElseThrow(NotFoundException::new);

        var blobRef = existingMidi.blobRef();
        blobService.getBlobById(blobRef)
            .orElseThrow(NotFoundException::new);

        if (!midiAndBlob.blob().blobId().equals(blobRef) || !midiAndBlob.metaData().blobRef().equals(blobRef)) {
            throw new ValidationException("Error, blob reference inconsistency");
        }

        MidiValidator.validate(midiAndBlob.blob().midiData());

        blobService.updateBlob(midiAndBlob.blob());
        midiMetaRepository.editMidiMeta(midiAndBlob.metaData());
        return midiAndBlob;
    }

    @Transactional
    public void deleteMidi(UUID deleteId) {
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

    private Logger getLogger() {
        return LogManager.getLogger(this.getClass());
    }

}
