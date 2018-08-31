package com.dianrong.blockchain.baas.app.example.dto;

import com.dianrong.blockchain.baas.sdk.dto.Response;

public class DataResponse extends Response {
    public class Data {
        private String value;

        public Data(String value) {
            this.value = value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public String getValue() {
            return this.value;
        }
    }

    private Data data;

    public DataResponse(String channel, String value, Status status, String message) {
        super(channel, status, message);
        this.data = new Data(value);
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }
}
