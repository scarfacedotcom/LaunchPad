import { ethers } from "hardhat";
import { LaunchPad } from "../typechain-types/LaunchPad";

async function main() {
  const [deployer, user] = await ethers.getSigners();

  // Deploy the contract
  const tokenA = "0xFfb99f4A02712C909d8F7cC44e67C87Ea1E71E83";
  const tokenB = "0x5886F287C4473Ce13c58474a261b31c881f8635d";
  const startTime = Math.floor(Date.now() / 1000);
  const endTime = startTime + 604_800; // One hour from now

  const launchPadFactory = await ethers.getContractFactory("LaunchPad", deployer);
  const launchPad = (await launchPadFactory.deploy(tokenA, tokenB, startTime, endTime)) as LaunchPad;
  await launchPad.deployed();

  console.log("Contract deployed to:", launchPad.address);

  // // Make a deposit
  const depositAmount = ethers.utils.parseEther("1"); // Deposit 1 ETH
  const tokenAContract = await ethers.getContractAt("IERC20", tokenA);
  const balanceBefore = await tokenAContract.balanceOf(user.address);

  await tokenAContract.approve(launchPad.address, depositAmount);
  await launchPad.connect(user).deposit(depositAmount);

  const balanceAfter = await tokenAContract.balanceOf(user.address);
  const allocation = await launchPad.allocations(user.address);

  console.log(`Deposited ${ethers.utils.formatEther(depositAmount)} ETH`);
  console.log(`Received ${allocation.toString()} Token B`);
  console.log(`Token A balance before deposit: ${ethers.utils.formatEther(balanceBefore)}`);
  console.log(`Token A balance after deposit: ${ethers.utils.formatEther(balanceAfter)}`);

  // // Wait until the launch pad has ended
  // const launchPadDuration = endTime - startTime;
  // await ethers.provider.send("evm_increaseTime", [launchPadDuration + 1]); // Move past end time
  // await ethers.provider.send("evm_mine", []); // Mine a new block to update the timestamp

  // // Withdraw tokens
  // const allocationBefore = await launchPad.allocations(user.address);
  // await launchPad.connect(user).withdraw();
  // const allocationAfter = await launchPad.allocations(user.address);

  // console.log(`Withdrew ${allocationAfter.sub(allocationBefore)} Token B`);

  // // Emergency withdraw (only owner can call this function)
  // const owner = deployer;
  // const balanceBefore2 = await ethers.provider.getBalance(owner.address);
  // await launchPad.connect(owner).emergencyWithdraw();
  // const balanceAfter2 = await ethers.provider.getBalance(owner.address);

  // console.log(`Emergency withdrew all Ether to ${owner.address}`);
  // console.log(`Balance before: ${ethers.utils.formatEther(balanceBefore2)}`);
  // console.log(`Balance after: ${ethers.utils.formatEther(balanceAfter2)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
