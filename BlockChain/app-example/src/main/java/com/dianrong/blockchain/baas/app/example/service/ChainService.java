package com.dianrong.blockchain.baas.app.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

import com.dianrong.blockchain.baas.sdk.AppClient;
import com.dianrong.blockchain.baas.sdk.common.Chain;
import com.dianrong.blockchain.baas.sdk.common.Channel;
import com.dianrong.blockchain.baas.sdk.dto.*;

import com.dianrong.blockchain.baas.sdk.exception.ConfigurationException;
import com.dianrong.blockchain.baas.sdk.exception.fabric.FabricException;

import com.dianrong.blockchain.baas.app.example.exception.InternalException;

@Service
public class ChainService {
    private static final Logger LOG = LoggerFactory.getLogger(ChainService.class);

    @Value("${app.config.path}")
    private String configPath;

    @Value("${app.chain.name}")
    private String chainName;

    @Value("${app.channel.name}")
    private String channelName;

    @Value("${app.chaincode.name}")
    private String chaincodeName;

    @Value("${app.chaincode.version}")
    private String chaincodeVersion;

    @Value("${app.chaincode.path}")
    private String chaincodePath;

    @Value("${app.chaincode.intantiation.fnc}")
    private String intantiationFnc;

    @Value("${app.chaincode.intantiation.args}")
    private String intantiationArgs;

    private AppClient client;
    private Chain chain;

    @PostConstruct
    public void init() throws InternalException {
        
        
        LOG.info("Loading config {}", configPath);
        
        
        try {
            client = new AppClient(configPath);
            chain = client.getChain(chainName);
        } catch (ConfigurationException | FabricException e) {
            LOG.error("Initialization failed with error message {}", e.getMessage());
            throw new InternalException();
        }

        if (!channelExists(channelName)) {
            LOG.info("Start to create channel {}", channelName);
            ChannelResponse channelResponse = createChannel(new ChannelRequest(channelName));
            if (channelResponse.getStatus() != Response.Status.SUCCESS) {
                LOG.error("Creating channel {} failed with error message {}", channelName, channelResponse.getMessage());
                throw new RuntimeException("Creating channel failed");
            }
        }

        ChaincodeResponse chaincodeResponse;
        try {
            chaincodeResponse = chain.getChaincodeStatus(new ChaincodeRequest(channelName, chaincodeName, chaincodeVersion, chaincodePath));
        } catch (ConfigurationException | FabricException e) {
            LOG.error("Getting chaincode status failed with error message {}", e.getMessage());
            throw new InternalException();
        }

        if (chaincodeResponse.getStatus() == Response.Status.SUCCESS) {
            if (chaincodeResponse.getData().getChaincodeStatus() == ChaincodeResponse.ChaincodeStatus.INSTANTIATED) {
                LOG.info("Chaincode {} is instantiated already.", chaincodeName);
                return;
            }

            if (chaincodeResponse.getData().getChaincodeStatus() == ChaincodeResponse.ChaincodeStatus.UNINSTALLED) {
                LOG.info("Start to install chaincode {}", chaincodeName);

                LOG.info("Sending install chaincode {} request", chaincodeName);
                ChaincodeTransactionRequest installRequest = new ChaincodeTransactionRequest(channelName, chaincodeName, chaincodeVersion, chaincodePath, null, null);
                ChaincodeTransactionResponse installResponse = installChaincode(installRequest);
                if (installResponse.getStatus() == ChaincodeTransactionResponse.Status.SUCCESS) {
                    LOG.info("Successfully installed chaincode {}. TxID: {}", chaincodeName, installResponse.getData().getChaincodeTransaction().getTransactionID());
                } else {
                    LOG.info(installResponse.getMessage());
                    throw new RuntimeException("Installing chaincode failed");
                }
            }

            LOG.info("Sending instantiate chaincode {} request", chaincodeName);
            ChaincodeTransactionRequest instantiateRequest = new ChaincodeTransactionRequest(channelName, chaincodeName, chaincodeVersion, chaincodePath, intantiationFnc, intantiationArgs.split(","));
            ChaincodeTransactionResponse instantiateResponse = instantiateChaincode(instantiateRequest);
            if (instantiateResponse.getStatus() == ChaincodeTransactionResponse.Status.SUCCESS) {
                LOG.info("Successfully instantiated chaincode {}. TxID: {}", chaincodeName, instantiateResponse.getData().getChaincodeTransaction().getTransactionID());
            } else {
                System.out.println(instantiateResponse.getMessage());
                throw new RuntimeException("Instatiating chaincode failed");
            }
        } else {
            throw new RuntimeException("Querying chaincode status failed");
        }
    }

    private boolean channelExists(String channelName) {
        boolean found = false;
        try {
            found = chain.channelExists(channelName);
        } catch (ConfigurationException | FabricException e) {
            LOG.warn("Query channel failed with error message: {}", e.getMessage());
        }
        return found;
    }

    public ChannelResponse createChannel(ChannelRequest chl) throws InternalException {

        Channel channel;
        try {
            channel = chain.createChannel(chl.getChannelName());
        } catch (ConfigurationException | FabricException e) {
            LOG.error("Creating channel failed with error message {}", e.getMessage());
            throw new InternalException();
        }
        return new ChannelResponse(chl.getChannelName(), ChannelResponse.Status.SUCCESS, "Successfully created channel");
    }

    public ChaincodeTransactionResponse installChaincode(ChaincodeTransactionRequest tx) throws InternalException {
        try {
            ChaincodeTransactionResponse response = chain.installChaincode(tx);
            if (response.getStatus() == Response.Status.FAILURE) {
                LOG.error("Installing chaincode failed with error message {}", response.getMessage());
                throw new InternalException();
            }
            return response;
        } catch (ConfigurationException | FabricException e) {
            LOG.error("Installing chaincode failed with error message {}", e.getMessage());
            throw new InternalException();
        }
    }

    public ChaincodeTransactionResponse instantiateChaincode(ChaincodeTransactionRequest tx) throws InternalException {
        try {
            ChaincodeTransactionResponse response = chain.instantiateChaincode(tx);
            if (response.getStatus() == Response.Status.FAILURE) {
                LOG.error("Instantiating chaincode failed with error message {}", response.getMessage());
                throw new InternalException();
            }
            return response;
        } catch (ConfigurationException | FabricException e) {
            LOG.error("Instantiating chaincode failed with error message {}", e.getMessage());
            throw new InternalException();
        }
    }

    public ChaincodeTransactionResponse invokeChaincode(ChaincodeTransactionRequest tx) throws InternalException {
        try {
            ChaincodeTransactionResponse response = chain.invokeChaincode(tx);
            if (response.getStatus() == Response.Status.FAILURE) {
                LOG.error("Invoking chaincode failed with error message {}", response.getMessage());
                throw new InternalException();
            }
            return response;
        } catch (ConfigurationException | FabricException e) {
            LOG.error("Invoking chaincode failed with error message {}", e.getMessage());
            throw new InternalException();
        }
    }

    public ChaincodeTransactionResponse queryChaincode(ChaincodeTransactionRequest tx) throws InternalException {
        try {
            ChaincodeTransactionResponse response = chain.queryChaincode(tx);
            if (response.getStatus() == Response.Status.FAILURE) {
                LOG.error("Querying chaincode failed with error message {}", response.getMessage());
                throw new InternalException();
            }
            return response;
        } catch (ConfigurationException | FabricException e) {
            LOG.error("Querying chaincode failed with error message {}", e.getMessage());
            throw new InternalException();
        }
    }

    public BlockResponse getLatestBlock(BlockRequest blk) throws InternalException {
        try {
            BlockResponse response = chain.getLatestBlock(blk);
            if (response.getStatus() == Response.Status.FAILURE) {
                LOG.error("Getting latest block failed with error message {}", response.getMessage());
                throw new InternalException();
            }
            return response;
        } catch (ConfigurationException | FabricException e) {
            LOG.error("Getting latest block failed with error message {}", e.getMessage());
            throw new InternalException();
        }
    }

    public BlocksResponse getLatestBlocks(BlocksRequest blk) throws InternalException {
        try {
            BlocksResponse response = chain.getLatestBlocks(blk);
            if (response.getStatus() == Response.Status.FAILURE) {
                LOG.error("Getting latest blocks failed with error message {}", response.getMessage());
                throw new InternalException();
            }
            return response;
        } catch (ConfigurationException | FabricException e) {
            LOG.error("Getting latest blocks failed with error message {}", e.getMessage());
            throw new InternalException();
        }
    }
}
