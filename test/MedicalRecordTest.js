const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalRecord", () => {
    let medical, user1, transactionResponse, transactionReceipt;

    beforeEach(async () => {
        const accounts = await ethers.getSigners();
        user1 = accounts[1];
        const Medical = await ethers.getContractFactory("MedicalRecord");
        medical = await Medical.connect(user1).deploy();
    });

    describe("Deployment", () => {
        it("The contract is deployed successfully", async () => {
            expect(await medical.getAddress()).to.be.properAddress;
        });
    });

    describe("Add Record", () => {
        beforeEach(async () => {
            transactionResponse = await medical
                .connect(user1)
                .addRecord(
                    "Wastron",
                    22,
                    "Male",
                    "B positive",
                    "Dengue",
                    "Dengue",
                    "Dengue"
                );
            transactionReceipt = await transactionResponse.wait();
        });

// Changes that I made:

// Contract Interface: I use medical.interface to get the contract's interface, which allows us to parse the logs.
// Event Log Finding: Instead of using transactionReceipt.events, I use transactionReceipt.logs. This is because in some versions of ethers.js, the events are not directly accessible on the receipt.
// Manual Log Parsing: I manually parse each log to find the one corresponding to our 'MedicalRecord__AddRecord' event.
// Error Handling: I've added a try-catch block in the log finding process to handle potential parsing errors.

        it("Emits an add record event", async () => {
            // Get the contract interface
            const contractInterface = medical.interface;

            // Find the event log
            const eventLog = transactionReceipt.logs.find(log => {
                try {
                    const parsedLog = contractInterface.parseLog(log);
                    return parsedLog.name === 'MedicalRecord__AddRecord';
                } catch {
                    return false;
                }
            });

            expect(eventLog).to.not.be.undefined;

            // Parse the event log
            const parsedLog = contractInterface.parseLog(eventLog);
            
            const [recordId, timestamp, name, age, gender, bloodType, allergies, diagnosis, treatment] = parsedLog.args;

            expect(recordId).to.equal(1);
            expect(timestamp).to.be.gt(0);
            expect(name).to.equal("Wastron");
            expect(age).to.equal(22);
            expect(gender).to.equal("Male");
            expect(bloodType).to.equal("B positive");
            expect(allergies).to.equal("Dengue");
            expect(diagnosis).to.equal("Dengue");
            expect(treatment).to.equal("Dengue");
        });
    });
});