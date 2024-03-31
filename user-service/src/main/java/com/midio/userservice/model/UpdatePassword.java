package com.midio.userservice.model;

public record UpdatePassword(
    String currentPassword,
    String newPassword
) {
}
