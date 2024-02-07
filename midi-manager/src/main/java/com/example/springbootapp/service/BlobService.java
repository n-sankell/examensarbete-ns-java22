package com.example.springbootapp.service;

import com.example.springbootapp.model.Blob;
import com.example.springbootapp.repository.MidiBlobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BlobService {

    private final MidiBlobRepository midiBlobRepository;

    @Autowired
    public BlobService(MidiBlobRepository midiBlobRepository) {
        this.midiBlobRepository = midiBlobRepository;
    }

    @Transactional
    public List<Blob> getBlobs() {
        var result = midiBlobRepository.getAllBlobs();
        if (result.isEmpty()) {
            throw new RuntimeException("Error, not found");
        }
        return result;
    }

    @Transactional
    public Blob getBlobById(UUID id) {
        return midiBlobRepository.getBlobById(id)
            .orElseThrow(RuntimeException::new);
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
    public void deleteBlob(UUID id) {
        midiBlobRepository.deleteBlob(id);
    }

}
