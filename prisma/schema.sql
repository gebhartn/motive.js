CREATE TABLE "public"."User" (
	id SERIAL PRIMARY KEY NOT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "public"."Todo" (
	id SERIAL PRIMARY KEY NOT NULL,
	category VARCHAR(255) NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
	content TEXT,
	"authorId" INTEGER NOT NULL,
	FOREIGN KEY ("authorId") REFERENCES "public"."User"(id)
);

