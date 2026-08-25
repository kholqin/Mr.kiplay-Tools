CREATE TABLE `worker_jobs` (
	`id` varchar(36) NOT NULL,
	`workspaceId` int NOT NULL,
	`task` enum('aggregatePortObservations','summarizeReconResults') NOT NULL,
	`status` enum('queued','running','completed','failed','cancelled') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`startedAt` timestamp,
	`finishedAt` timestamp,
	`result` json,
	`error` varchar(255),
	CONSTRAINT `worker_jobs_id` PRIMARY KEY(`id`)
);
