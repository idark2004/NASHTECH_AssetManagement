package com.nashtech.rookies.AssetManagement.exception;

public class DuplicateCategoryNameException extends RuntimeException{
    public DuplicateCategoryNameException() {
        super("Category is already existed. Please enter a different category");
    }
}
