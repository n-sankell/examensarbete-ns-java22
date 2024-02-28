package com.example.midimanager.converter;

import com.example.midimanager.model.MidiAndBlob;
import com.example.midimanager.model.Blob;
import com.example.midimanager.model.Midi;
import generatedapi.model.BinaryDataDto;
import generatedapi.model.MidiCreateRequestDto;
import generatedapi.model.MidiDto;
import generatedapi.model.MidiEditBinaryRequestDto;
import generatedapi.model.MidiEditMetaRequestDto;
import generatedapi.model.MidiEditRequestDto;
import generatedapi.model.MidiWithDataDto;
import generatedapi.model.MidisDto;
import org.apache.tomcat.util.codec.binary.Base64;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public class MidiConverter {

    public static MidiWithDataDto convert(MidiAndBlob midiAndBlob) {
        return new MidiWithDataDto()
            .meta(convert(midiAndBlob.metaData()))
            .binary(convert(midiAndBlob.blob()));
    }

    public static MidisDto convert(List<Midi> midis) {
        return new MidisDto()
            .midis(midis.stream().map(
                MidiConverter::convert).toList()
            );
    }

    public static Midi convert(MidiDto midi) {
        return new Midi(
            midi.getMidiId(),
            midi.getBlobRef(),
            midi.getUserRef(),
            midi.getIsPrivate(),
            midi.getFilename(),
            midi.getArtist(),
            midi.getTitle(),
            midi.getDateCreated().toZonedDateTime(),
            midi.getDateEdited().toZonedDateTime()
        );
    }

    public static MidiAndBlob convert(MidiWithDataDto midiWithDataDto) {
        return new MidiAndBlob(
            convert(midiWithDataDto.getMeta()),
                convert(midiWithDataDto.getBinary())
        );
    }

    public static MidiDto convert(Midi midi) {
        return new MidiDto()
            .midiId(midi.midiId())
            .userRef(midi.userRef())
            .blobRef(midi.blobRef())
            .filename(midi.filename())
            .isPrivate(midi.isPrivate())
            .artist(midi.artist())
            .title(midi.title())
            .dateCreated(midi.dateCreated().toOffsetDateTime())
            .dateEdited(midi.dateEdited().toOffsetDateTime());
    }

    public static BinaryDataDto convert(Blob blob) {
        return new BinaryDataDto()
            .binaryId(blob.blobId())
            .midiFile(convert(blob.midiData()));
    }

    public static Blob convert(BinaryDataDto binaryDataDto) {
        return new Blob(
            binaryDataDto.getBinaryId(),
            convert(binaryDataDto.getMidiFile())
        );
    }

    public static String convert(byte[] bytes) {
        return Base64.encodeBase64String(bytes);
    }

    public static byte[] convert(String encodedString) {
        return Base64.decodeBase64(encodedString);
    }

    public static Blob convert(UUID blobId, byte[] bytes) {
        return new Blob(blobId, bytes);
    }

    public static MidiAndBlob buildCreateData(MidiCreateRequestDto createData, UUID userId) {
        var blobId = UUID.randomUUID();
        return new MidiAndBlob(
            new Midi(
                UUID.randomUUID(),
                blobId,
                userId,
                createData.getIsPrivate(),
                createData.getFilename(),
                createData.getArtist(),
                createData.getTitle(),
                ZonedDateTime.now(),
                ZonedDateTime.now()
            ),
            new Blob(
                blobId,
                MidiConverter.convert(createData.getMidiFile()))
        );
    }

    public static MidiAndBlob buildEditData(MidiEditRequestDto editData, UUID id) {
        return new MidiAndBlob(
            buildMetaData(editData.getMetadata(), id),
            buildBlobData(editData.getBinaryData())
        );
    }

    public static MidiAndBlob buildEditData(MidiEditMetaRequestDto editData, UUID id) {
        return new MidiAndBlob(
            buildMetaData(editData, id),
            null
        );
    }

    public static MidiAndBlob buildEditData(MidiEditBinaryRequestDto editData, UUID ignored) {
        return new MidiAndBlob(
            null,
            buildBlobData(editData)
        );
    }

    public static Midi buildMetaData(MidiEditMetaRequestDto editData, UUID id) {
        return new Midi(
            id,
            null,
            null,
            editData.getIsPrivate(),
            editData.getFilename(),
            editData.getArtist(),
            editData.getTitle(),
            null,
            ZonedDateTime.now()
        );
    }

    public static Blob buildBlobData(MidiEditBinaryRequestDto editData) {
        return new Blob(
            null,
            MidiConverter.convert(editData.getMidiFile())
        );
    }

}
