package com.example.midimanager.service;

import com.example.midimanager.model.Blob;
import com.example.midimanager.model.BlobId;
import com.example.midimanager.repository.MidiBlobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class BlobService {

    private final MidiBlobRepository midiBlobRepository;

    @Autowired
    public BlobService(MidiBlobRepository midiBlobRepository) {
        this.midiBlobRepository = midiBlobRepository;
    }

    public Optional<Blob> getBlobById(BlobId id) {
        return midiBlobRepository.getBlobById(id);
    }

    @Transactional
    public void saveBlob(Blob blob) {
        midiBlobRepository.saveBlob(blob);
    }

    @Transactional
    public void updateBlob(Blob blob) {
        midiBlobRepository.updateMidiData(blob);
    }

    @Transactional
    public void deleteBlob(BlobId id) {
        midiBlobRepository.deleteBlob(id);
    }

}
