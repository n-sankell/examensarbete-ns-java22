package com.example.midimanager.converter;

import com.example.midimanager.model.Blob;
import com.example.midimanager.model.BlobId;
import com.example.midimanager.model.Midi;
import com.example.midimanager.model.MidiAndBlob;
import com.example.midimanager.model.MidiId;
import com.example.midimanager.model.UserId;
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
            new MidiId(midi.getMidiId()),
            new BlobId(midi.getBlobRef()),
            new UserId(midi.getUserRef()),
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
            .midiId(midi.midiId().id())
            .userRef(midi.userRef().id())
            .blobRef(midi.blobRef().id())
            .filename(midi.filename())
            .isPrivate(midi.isPrivate())
            .artist(midi.artist())
            .title(midi.title())
            .dateCreated(midi.dateCreated().toOffsetDateTime())
            .dateEdited(midi.dateEdited().toOffsetDateTime());
    }

    public static BinaryDataDto convert(Blob blob) {
        return new BinaryDataDto()
            .binaryId(blob.blobId().id())
            .midiFile(convert(blob.midiData()));
    }

    public static Blob convert(BinaryDataDto binaryDataDto) {
        var blobId = new BlobId(binaryDataDto.getBinaryId());
        return new Blob(
            blobId,
            convert(binaryDataDto.getMidiFile())
        );
    }

    public static String convert(byte[] bytes) {
        return Base64.encodeBase64String(bytes);
    }

    public static byte[] convert(String encodedString) {
        return Base64.decodeBase64(encodedString);
    }

    public static Blob convert(BlobId blobId, byte[] bytes) {
        return new Blob(blobId, bytes);
    }

    public static MidiAndBlob buildCreateData(MidiCreateRequestDto createData, UserId userId) {
        var midiId = MidiId.newMidiId();
        var blobId = BlobId.newBlobId();
        return new MidiAndBlob(
            new Midi(
                midiId,
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

    public static MidiAndBlob buildEditData(MidiEditRequestDto editData, MidiId midiId) {
        return new MidiAndBlob(
            buildMetaData(editData.getMetadata(), midiId),
            buildBlobData(editData.getBinaryData())
        );
    }

    public static MidiAndBlob buildEditData(MidiEditMetaRequestDto editData, MidiId midiId) {
        return new MidiAndBlob(
            buildMetaData(editData, midiId),
            null
        );
    }

    public static MidiAndBlob buildEditData(MidiEditBinaryRequestDto editData, MidiId ignored) {
        return new MidiAndBlob(
            null,
            buildBlobData(editData)
        );
    }

    public static Midi buildMetaData(MidiEditMetaRequestDto editData, MidiId midiId) {
        return new Midi(
            midiId,
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
