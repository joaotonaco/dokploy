import { relations } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod";
import { gitProvider } from "./git-provider";

export const github = pgTable("github", {
	githubId: text("githubId")
		.notNull()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	githubAppName: text("githubAppName"),
	githubAppId: integer("githubAppId"),
	githubClientId: text("githubClientId"),
	githubClientSecret: text("githubClientSecret"),
	githubInstallationId: text("githubInstallationId"),
	githubPrivateKey: text("githubPrivateKey"),
	githubWebhookSecret: text("githubWebhookSecret"),
	gitProviderId: text("gitProviderId")
		.notNull()
		.references(() => gitProvider.gitProviderId, { onDelete: "cascade" }),
});

export const githubProviderRelations = relations(github, ({ one }) => ({
	gitProvider: one(gitProvider, {
		fields: [github.gitProviderId],
		references: [gitProvider.gitProviderId],
	}),
}));

const createSchema = createInsertSchema(github);
export const apiCreateGithub = createSchema.extend({
	githubAppName: z.string().optional(),
	githubAppId: z.number().optional(),
	githubClientId: z.string().optional(),
	githubClientSecret: z.string().optional(),
	githubInstallationId: z.string().optional(),
	githubPrivateKey: z.string().optional(),
	githubWebhookSecret: z.string().nullable(),
	gitProviderId: z.string().optional(),
});

export const apiFindGithubBranches = z.object({
	repo: z.string().min(1),
	owner: z.string().min(1),
	githubId: z.string().optional(),
});

export const apiFindOneGithub = createSchema
	.extend({
		githubId: z.string().min(1),
	})
	.pick({ githubId: true });
