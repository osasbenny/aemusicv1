CREATE TABLE `beats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`genre` varchar(100) NOT NULL,
	`mood` varchar(100) NOT NULL,
	`bpm` int NOT NULL,
	`price` int NOT NULL,
	`description` text,
	`audioFileKey` varchar(500) NOT NULL,
	`audioUrl` varchar(1000) NOT NULL,
	`coverImageKey` varchar(500),
	`coverImageUrl` varchar(1000),
	`licenseType` varchar(100) NOT NULL DEFAULT 'Basic',
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `beats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`beatId` int NOT NULL,
	`buyerEmail` varchar(320) NOT NULL,
	`buyerName` varchar(255),
	`stripePaymentId` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artistName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`songTitle` varchar(255) NOT NULL,
	`message` text,
	`fileType` varchar(50) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` varchar(1000) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`status` enum('pending','reviewed','accepted','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `submissions_id` PRIMARY KEY(`id`)
);
