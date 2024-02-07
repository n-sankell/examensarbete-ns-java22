package com.example.springbootapp.util;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DbUtil {

    public static ZonedDateTime convertDate(String date) {
        var localDateTime = LocalDateTime.parse(date.substring(0, 26), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS"));
        var zoneOffset = ZoneOffset.of(date.substring(26));
        return ZonedDateTime.of(localDateTime, zoneOffset);
    }

}
