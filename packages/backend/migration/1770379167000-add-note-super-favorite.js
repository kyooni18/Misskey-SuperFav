/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class AddNoteSuperFavorite1770379167000 {
	name = 'AddNoteSuperFavorite1770379167000'

	/**
	 * @param {QueryRunner} queryRunner
	 */
	async up(queryRunner) {
		await queryRunner.query(`CREATE TABLE "note_super_favorite" ("id" character varying(32) NOT NULL, "userId" character varying(32) NOT NULL, "noteId" character varying(32) NOT NULL, CONSTRAINT "PK_a04ba956df5089b40f680165f50" PRIMARY KEY ("id"))`);
		await queryRunner.query(`CREATE INDEX "IDX_217cfecf2b9f4c2b3e1f39b59e" ON "note_super_favorite" ("userId") `);
		await queryRunner.query(`CREATE UNIQUE INDEX "IDX_66f9ea5e9a5fb53c52478fc751" ON "note_super_favorite" ("userId", "noteId") `);
		await queryRunner.query(`ALTER TABLE "note_super_favorite" ADD CONSTRAINT "FK_217cfecf2b9f4c2b3e1f39b59ef" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "note_super_favorite" ADD CONSTRAINT "FK_6f488e85508e4c5f8e0bc163d56" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
	}

	/**
	 * @param {QueryRunner} queryRunner
	 */
	async down(queryRunner) {
		await queryRunner.query(`ALTER TABLE "note_super_favorite" DROP CONSTRAINT "FK_6f488e85508e4c5f8e0bc163d56"`);
		await queryRunner.query(`ALTER TABLE "note_super_favorite" DROP CONSTRAINT "FK_217cfecf2b9f4c2b3e1f39b59ef"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_66f9ea5e9a5fb53c52478fc751"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_217cfecf2b9f4c2b3e1f39b59e"`);
		await queryRunner.query(`DROP TABLE "note_super_favorite"`);
	}
}
