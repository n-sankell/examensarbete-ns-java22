package com.example.springbootapp.converter;

import com.example.springbootapp.model.Blob;
import com.example.springbootapp.model.Midi;
import com.example.springbootapp.model.MidiAndBlob;
import generatedapi.model.BinaryDataDto;
import generatedapi.model.MidiDto;
import generatedapi.model.MidiWithDataDto;
import generatedapi.model.MidisDto;
import org.apache.tomcat.util.codec.binary.Base64;

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

}
