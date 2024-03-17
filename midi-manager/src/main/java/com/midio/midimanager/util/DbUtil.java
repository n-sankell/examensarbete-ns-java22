package com.midio.midimanager.util;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DbUtil {

    public static ZonedDateTime convertDate(String date) {
        String formattedDate = date + ":00";
        return ZonedDateTime.parse(formattedDate, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSSxxx"));
    }

    public static ZonedDateTime convertDate(Timestamp timestamp) {
        return timestamp.toInstant().atZone(ZoneId.systemDefault());
    }

    public static Timestamp convertDate(ZonedDateTime date) {
        return Timestamp.from(date.toInstant().atZone(ZoneId.systemDefault()).toInstant());
    }

}
