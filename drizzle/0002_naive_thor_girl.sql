CREATE TABLE `evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`scanJobId` int NOT NULL,
	`findingId` int,
	`kind` varchar(80) NOT NULL,
	`content` text NOT NULL,
	`sanitized` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evidence_id` PRIMARY KEY(`id`)
);
