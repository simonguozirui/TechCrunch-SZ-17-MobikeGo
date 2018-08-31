package com.dianrong.blockchain.baas.app.example.exception;

public class InternalException extends Exception {
    private static final long serialVersionUID = 1L;

    public InternalException(String message, Throwable parent) {
        super(message, parent);
    }

    public InternalException(String message) {
        super(message);
    }

    public InternalException(Throwable t) {
        super(t);
    }

    public InternalException() { super("Internal Error"); }
}