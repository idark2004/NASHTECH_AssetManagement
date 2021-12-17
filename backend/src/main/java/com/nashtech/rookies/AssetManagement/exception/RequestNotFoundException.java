package com.nashtech.rookies.AssetManagement.exception;

public class RequestNotFoundException extends RuntimeException{
    public RequestNotFoundException(String message) {
        super(message);
    }
}
