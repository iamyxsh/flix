import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { utils } from "ethers"
import { ethers } from "hardhat"

describe("Flix", function () {
	const MOVIE_NAME = "Top Gun : Maverick"

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

	const returnCreatedFlix = async (address: string, index: number = 1) => {
		return ethers
			.getContractAt("FlixFactory", address)
			.then(
				async (factory) =>
					await ethers.getContractAt("Flix", await factory.idToAddress(index))
			)
	}

	const createFlix = async (
		address: string,
		signer: SignerWithAddress,
		name: string = MOVIE_NAME
	) => {
		return ethers
			.getContractAt("FlixFactory", address)
			.then(async (factory) => {
				await factory
					.connect(signer)
					.createMovie(name, 100, utils.parseEther("10"), Date.now())
				return factory.addressToName(await factory.idToAddress(0))
			})
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

			expect(await topGun.movieName()).to.equal("Top Gun : Maverick")
		})
	})

	describe("Movie Creation", async () => {
		it("create a movie with correct name", async () => {
			const flix = await returnFlix()
			const flixFactory = await returnFlixFactory(flix.address)
			const [_, admin] = await ethers.getSigners()

			const name = await createFlix(flixFactory.address, admin)

			expect(name).to.be.equal(MOVIE_NAME)
		})
	})

	describe("Movie Ticket Booking", async () => {
		it("can book movie tickets", async () => {
			const flix = await returnFlix()
			const flixFactory = await returnFlixFactory(flix.address)
			const [_, admin, buyer] = await ethers.getSigners()

			await createFlix(flixFactory.address, admin)

			const topGun = await returnCreatedFlix(flixFactory.address, 0)

			await topGun.connect(buyer).bookTickets(1, {
				value: utils.parseEther("10"),
			})

			expect(await topGun.totalSold()).to.be.equal(1)
			expect(await topGun.collection()).to.be.equal(utils.parseEther("10"))
			expect(await topGun.balanceOf(buyer.address)).to.be.equal(1)
		})
	})
})
