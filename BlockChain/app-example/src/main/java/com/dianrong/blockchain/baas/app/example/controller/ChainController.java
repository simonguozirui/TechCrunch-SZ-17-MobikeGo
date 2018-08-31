package com.dianrong.blockchain.baas.app.example.controller;

import com.dianrong.blockchain.baas.app.example.dto.DataResponse;
import com.dianrong.blockchain.baas.app.example.exception.InternalException;
import com.dianrong.blockchain.baas.sdk.dto.ChannelRequest;
import com.dianrong.blockchain.baas.app.example.service.ChainService;
import com.dianrong.blockchain.baas.sdk.dto.*;
import com.dianrong.blockchain.baas.sdk.exception.ConfigurationException;
import com.dianrong.blockchain.baas.sdk.exception.fabric.FabricException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChainController {
    private static final Logger LOG = LoggerFactory.getLogger(ChainController.class);

    @Autowired
    private ChainService chainService;

    @GetMapping(value = "/{channelName}/block/latest")
    public BlockResponse getLatestBlock(@PathVariable String channelName) throws InternalException {
        //TODO cache result
        return chainService.getLatestBlock(new BlockRequest(channelName, ""));
    }

    @GetMapping(value = "/{channelName}/block/initLoadBlocks")
    public BlocksResponse getLatestBlocks(@PathVariable String channelName, @RequestParam(value = "n", required=false) Integer n) throws InternalException {
        return chainService.getLatestBlocks(new BlocksRequest(channelName, "", n == null ? 10 : n));
    }

    @GetMapping(value = "/{channelName}/node/nodeNumber")
    public DataResponse getNodeNumber(@PathVariable String channelName) throws InternalException {
        return new DataResponse(channelName,"4", Response.Status.SUCCESS, "");
    }

    @RequestMapping(value = "/createChannel", method = RequestMethod.POST)
    public ChannelResponse createChannel(@RequestBody ChannelRequest chl) throws InternalException {
        return chainService.createChannel(chl);
    }

    @RequestMapping(value = "/installChaincode", method = RequestMethod.POST)
    public ChaincodeTransactionResponse installChaincode(@RequestBody ChaincodeTransactionRequest tx) throws InternalException {
        return chainService.installChaincode(tx);
    }

    @RequestMapping(value = "/instantiateChaincode", method = RequestMethod.POST)
    public ChaincodeTransactionResponse instantiateChaincode(@RequestBody ChaincodeTransactionRequest tx) throws InternalException {
        return chainService.instantiateChaincode(tx);
    }

    @RequestMapping(value = "/invokeChaincode", method = RequestMethod.POST)
    public ChaincodeTransactionResponse invokeChaincode(@RequestBody ChaincodeTransactionRequest tx) throws InternalException {
        return chainService.invokeChaincode(tx);
    }

    @RequestMapping(value = "/queryChaincode", method = RequestMethod.POST)
    public ChaincodeTransactionResponse queryChaincode(@RequestBody ChaincodeTransactionRequest tx) throws InternalException {
        return chainService.queryChaincode(tx);
    }
}

