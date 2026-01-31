CREATE TABLE `episodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`source` enum('text','youtube') NOT NULL DEFAULT 'text',
	`youtubeUrl` text,
	`transcript` text NOT NULL,
	`wordCount` int NOT NULL DEFAULT 0,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`extractionResult` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `episodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `outreach_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`episodeId` int NOT NULL,
	`candidateName` varchar(255) NOT NULL,
	`candidateEmail` varchar(320),
	`status` enum('drafted','sent','responded','booked','declined') NOT NULL DEFAULT 'drafted',
	`emailContent` text,
	`sentAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `outreach_tracking_id` PRIMARY KEY(`id`)
);
