CREATE TABLE `assessment_targets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`value` varchar(255) NOT NULL,
	`targetType` enum('domain','url','ip','cidr') NOT NULL DEFAULT 'domain',
	`inScope` int NOT NULL DEFAULT 1,
	`excludedReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessment_targets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_workspaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`description` text,
	`authorizationConfirmed` int NOT NULL DEFAULT 0,
	`authorizationEvidenceUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessment_workspaces_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`actorId` int NOT NULL,
	`action` varchar(120) NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `findings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`scanJobId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(80) NOT NULL,
	`severity` enum('critical','high','medium','low','info') NOT NULL DEFAULT 'info',
	`confidence` enum('high','medium','low') NOT NULL DEFAULT 'low',
	`target` varchar(255) NOT NULL,
	`evidence` text,
	`remediation` text,
	`requiresManualValidation` int NOT NULL DEFAULT 1,
	`fingerprint` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `findings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scan_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`profileId` int NOT NULL,
	`status` enum('queued','preview','running','completed','failed','cancelled') NOT NULL DEFAULT 'queued',
	`currentStage` varchar(80),
	`targetCount` int NOT NULL DEFAULT 0,
	`findingCount` int NOT NULL DEFAULT 0,
	`startedAt` timestamp,
	`finishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scan_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scan_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`mode` enum('preview','safe') NOT NULL DEFAULT 'preview',
	`rateLimit` int NOT NULL DEFAULT 25,
	`timeoutSeconds` int NOT NULL DEFAULT 180,
	`nmapEnabled` int NOT NULL DEFAULT 1,
	`nucleiEnabled` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scan_profiles_id` PRIMARY KEY(`id`)
);
