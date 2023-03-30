import { ethers } from "hardhat";

async function main() {
  const startTime = Math.round(Date.now() / 1000);
  const endTime = startTime + 600;

  const tokenA = 0xFfb99f4A02712C909d8F7cC44e67C87Ea1E71E83
  const tokenB = 0x5886F287C4473Ce13c58474a261b31c881f8635d


  const LaunchPad = await ethers.getContractFactory("LaunchPad");
  const launchPad = await LaunchPad.deploy(tokenA,tokenB,startTime,endTime);

  await launchPad.deployed();

  console.log(
    `The LaunchPad Contract has been deployed to ${launchPad.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
