package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"strconv"
	"math"
)

type RentalContract struct {
	costPer10Sec int
	STARTTIME string
}

func (t *RentalContract) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("RentalContract Init")
	_, args := stub.GetFunctionAndParameters()

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	userId := args[0]

	_, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error("Expecting integer value for balance")
	}

	err = stub.PutState(userId, []byte(args[1]))
	if err != nil {
		return shim.Error(err.Error())
	}

	t.costPer10Sec, err = strconv.Atoi(args[2])
	if err != nil {
		return shim.Error("Expecting integer value for cost per hour")
	}

	t.STARTTIME = ".STARTTIME"
	return shim.Success(nil)
}

func (t *RentalContract) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()

	if function != "invoke" {
		return shim.Error("Unknown function call")
	}

	if len(args) < 2 {
		return shim.Error("Incorrect number of arguments. Expecting at least 2")
	}

	if args[0] == "start" {
		// start rental
		return t.start(stub, args)
	}

	if args[0] == "stop" {
		// stop rental
		return t.stop(stub, args)
	}
	if args[0] == "query" {
		// query account amount
		return t.query(stub, args)
	}

	return shim.Error("Unknown action, check the first argument, must be one of 'start', 'stop', or 'query'")
}

func (t *RentalContract) start(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3, function followed by 1 account and 1 start time")
	}

	userId := args[1]
	_, err := strconv.ParseUint(args[2], 10, 64)
	if err != nil {
		return shim.Error("Expecting integer value for start time")
	}

	balanceBytes, err := stub.GetState(userId)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if balanceBytes == nil {
		return shim.Error("Account not found")
	}

	balance, _ := strconv.Atoi(string(balanceBytes))

	if balance < 0 {
		return shim.Error("Low balance")
	}

	err = stub.PutState(userId + t.STARTTIME, []byte(args[2]))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

func (t *RentalContract) stop(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3, function followed by 1 account and 1 start time")
	}

	userId := args[1]
	stopTime, err := strconv.ParseUint(args[2], 10, 64)
	if err != nil {
		return shim.Error("Expecting integer value for start time")
	}

	timeBytes, err := stub.GetState(userId + t.STARTTIME)
	if err != nil {
		return shim.Error("Failed to get state")
	}

	if timeBytes == nil {
		return shim.Error("Account rental start time not found")
	}

	startTime, err := strconv.ParseUint(string(timeBytes), 10, 64)

	if startTime > stopTime {
		return shim.Error("Invalid start time")
	}

	balanceBytes, err := stub.GetState(userId)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if balanceBytes == nil {
		return shim.Error("Account not found")
	}

	balance, _ := strconv.Atoi(string(balanceBytes))

	elapsedTime := int(math.Ceil(float64(stopTime - startTime)/10))

	cost := elapsedTime * t.costPer10Sec

	balance = balance - cost

	err = stub.PutState(userId, []byte(strconv.Itoa(balance)))
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Printf("startTime=%d, stopTime=%d, elapsedTime=%d, cost=%d\n", startTime, stopTime, elapsedTime, cost)
	return shim.Success(nil)
}

func (t *RentalContract) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting name of the account to query")
	}

	userId := args[1]

	// Get the state from the ledger
	balanceBytes, err := stub.GetState(userId)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + userId + "\"}"
		return shim.Error(jsonResp)
	}

	if balanceBytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + userId + "\"}"
		return shim.Error(jsonResp)
	}

	jsonResp := "{\"Name\":\"" + userId + "\",\"Amount\":\"" + string(balanceBytes) + "\"}"
	fmt.Printf("Query Response:%s\n", jsonResp)
	return shim.Success(balanceBytes)
}

func main() {
	err := shim.Start(new(RentalContract))
	if err != nil {
		fmt.Printf("Error starting RentalContract chaincode: %s", err)
	}
}
