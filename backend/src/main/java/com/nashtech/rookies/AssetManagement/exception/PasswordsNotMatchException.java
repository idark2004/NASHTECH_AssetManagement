package com.nashtech.rookies.AssetManagement.exception;

public class PasswordsNotMatchException extends RuntimeException{
    public PasswordsNotMatchException(String message) {
        super(message);
    }
}
