CREATE TABLE `recon_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`targetId` int NOT NULL,
	`kind` enum('dns','subdomain') NOT NULL,
	`target` varchar(255) NOT NULL,
	`payload` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recon_results_id` PRIMARY KEY(`id`)
);
