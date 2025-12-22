CREATE TABLE `game_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`issueId` varchar(64) NOT NULL,
	`playerRole` varchar(64) NOT NULL,
	`resolutionChoice` text NOT NULL,
	`narrativeOutcome` text NOT NULL,
	`stateChanges` text,
	`round` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_issues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`issueId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` varchar(64),
	`status` enum('active','resolved','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `game_issues_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_issues_issueId_unique` UNIQUE(`issueId`)
);
--> statement-breakpoint
CREATE TABLE `game_roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roleId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_roles_roleId_unique` UNIQUE(`roleId`)
);
--> statement-breakpoint
CREATE TABLE `game_state` (
	`id` int AUTO_INCREMENT NOT NULL,
	`currentIssueId` varchar(64),
	`round` int NOT NULL DEFAULT 1,
	`status` enum('active','paused','completed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `game_state_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_variables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variableId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`currentValue` int NOT NULL DEFAULT 0,
	`minValue` int,
	`maxValue` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `game_variables_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_variables_variableId_unique` UNIQUE(`variableId`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderRole` varchar(64) NOT NULL,
	`recipientRole` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
