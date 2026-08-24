CREATE TABLE `port_scan_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`sourceReconId` int,
	`host` varchar(255) NOT NULL,
	`port` int NOT NULL,
	`state` enum('open','closed','timeout','error') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `port_scan_results_id` PRIMARY KEY(`id`)
);
