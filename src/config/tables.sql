CREATE TABLE "users"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "users_pk" PRIMARY KEY ("id")
);

CREATE TABLE "tokens"(
    "id" SERIAL NOT NULL,
    "token" uuid NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "tokens_pk" PRIMARY KEY ("id")
);

CREATE TABLE "links"(
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "linkShort" VARCHAR(255) NOT NULL UNIQUE,
    "visits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "links_pk" PRIMARY KEY ("id")
);

ALTER TABLE "tokens" ADD CONSTRAINT "tokens_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");
ALTER TABLE "links" ADD CONSTRAINT "links_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");