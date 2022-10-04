import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-watcher"

interface WatcherHardhatUserConfig extends HardhatUserConfig {
	watcher?: {
		[key: string]: {
			// key is the name for the watcherTask
			tasks?: any // Every task of the hardhat runtime is supported (including other plugins!)
			files?: string[] // Files, directories or glob patterns to watch for changes. (defaults to `[config.paths.sources]`, which itself defaults to the `contracts` dir)
			ignoredFiles?: string[] // Files, directories or glob patterns that should *not* be watched.
			verbose?: boolean // Turn on for extra logging
			clearOnStart?: boolean // Turn on to clear the logs (of older task runs) each time before running the task
			start?: string // Run any desirable command each time before the task runs
			runOnLaunch?: boolean // Turn on to run tasks immediately on launch. Be aware, tasks will be run with path parameter "none".
		}
	}
}

const config: WatcherHardhatUserConfig = {
	solidity: "0.8.17",
	watcher: {
		compilation: {
			tasks: ["compile"],
			files: ["./contracts", "./test"],
			ignoredFiles: ["**/.vscode"],
			verbose: true,
			clearOnStart: true,
			start: "echo Running my compilation task now..",
		},
		test: {
			tasks: ["test"],
			files: ["./contracts", "./test"],
			ignoredFiles: ["**/.vscode"],
			verbose: true,
			clearOnStart: true,
			start: "echo Running my compilation task now..",
		},
	},
}

export default config
