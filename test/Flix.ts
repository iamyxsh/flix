import { expect } from "chai"
import { ethers } from "hardhat"

describe("Flix", function () {
	const returnFlix = async () => {
		return ethers
			.getContractFactory("Flix")
			.then(async (factory) => await factory.deploy())
	}

	const returnFlixFactory = async (flixAddress: string) => {
		return ethers
			.getContractFactory("FlixFactory")
			.then(async (factory) => await factory.deploy(flixAddress))
	}

	describe("Deployment", async () => {
		it("can deployment contracts", async () => {
			const flix = await returnFlix()

			expect(flix.address).to.exist

			const flixFactory = await returnFlixFactory(flix.address)

			expect(flixFactory.address).to.exist
		})

		it("can create new flix contracts", async () => {
			const flix = await returnFlix()
			const flixFactory = await returnFlixFactory(flix.address)

			const [_, deployer] = await ethers.getSigners()

			await flixFactory
				.connect(deployer)
				.createMovie("Top Gun : Maverick", 100, 10, Date.now())

			const topGun = await ethers.getContractAt(
				"Flix",
				await flixFactory.idToAddress(0)
			)

			expect(await topGun.name()).to.equal("Top Gun : Maverick")
		})
	})
})
