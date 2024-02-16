package com.example.springbootapp.service;

import com.example.springbootapp.constants.Constants;
import com.example.springbootapp.converter.MidiConverter;
import com.example.springbootapp.model.Blob;
import com.example.springbootapp.model.Midi;
import com.example.springbootapp.model.MidiAndBlob;
import com.example.springbootapp.repository.MidiMetaRepository;
import com.example.springbootapp.util.MidiValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.util.List;
import java.util.UUID;

@Service
public class MidiService {

    private final MidiMetaRepository midiMetaRepository;
    private final BlobService blobService;

    @Autowired
    public MidiService(MidiMetaRepository midiMetaRepository, BlobService blobService) {
        this.midiMetaRepository = midiMetaRepository;
        this.blobService = blobService;
    }

    @Transactional
    public List<Midi> getMidis() {
        return midiMetaRepository.getMidiMeta();
    }

    @Transactional
    public List<Midi> getPublicMidis() {
        return midiMetaRepository.getPublicMidiMeta();
    }

    @Transactional
    public List<Midi> getMidisByUserId(UUID userId) {
        var result = midiMetaRepository.getMidiMetaByUserId(userId);
        if (result.isEmpty()) {
            throw new RuntimeException("Error, not found");
        }
        return result;
    }

    @Transactional
    public MidiAndBlob createMidi(MidiAndBlob midiAndBlob) {
        MidiValidator.validate(midiAndBlob.blob().midiData());

        midiMetaRepository.saveMidiMeta(midiAndBlob.metaData());
        blobService.saveBlob(midiAndBlob.blob());

        return midiAndBlob;
    }

    @Transactional
    public void deleteMidi(UUID deleteId) {
        var existingMidi = midiMetaRepository.getMidiMetaById(deleteId)
            .orElseThrow(RuntimeException::new);

        blobService.deleteBlob(existingMidi.blobRef());
        midiMetaRepository.deleteMidiMetaById(deleteId);
    }

    @Transactional
    public MidiAndBlob getMidiAndBlobById(UUID midiId) {
        var midiMeta = midiMetaRepository.getMidiMetaById(midiId)
            .orElseThrow(RuntimeException::new);
        var blobRef = midiMeta.blobRef();
        var blob = blobService.getBlobById(blobRef);

        return new MidiAndBlob(
            midiMeta,
            blob
        );
    }

    @Transactional
    public MidiAndBlob updateMidi(UUID midiId, MidiAndBlob midiAndBlob) {
        var existingMidi = midiMetaRepository.getMidiMetaById(midiId)
            .orElseThrow(RuntimeException::new);

        var blobRef = existingMidi.blobRef();
        blobService.getBlobById(blobRef);

        if (!midiAndBlob.blob().blobId().equals(blobRef) || !midiAndBlob.metaData().blobRef().equals(blobRef)) {
            throw new RuntimeException("Error, blob reference inconsistency");
        }

        blobService.updateBlob(midiAndBlob.blob());
        midiMetaRepository.editMidiMeta(midiAndBlob.metaData());
        return midiAndBlob;
    }

    @Transactional
    public void updateMidiById(UUID midiId) {
        var blobRef = midiMetaRepository.getMidiMetaById(midiId).orElseThrow(RuntimeException::new).blobRef();
        var data = MidiConverter.convert(Constants.tetrisBase64);
        blobService.updateBlob(new Blob(blobRef, data));
    }

}
