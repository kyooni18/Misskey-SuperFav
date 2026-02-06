/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import ms from 'ms';
import type { NoteSuperFavoritesRepository } from '@/models/_.js';
import { IdService } from '@/core/IdService.js';
import { Endpoint } from '@/server/api/endpoint-base.js';
import { GetterService } from '@/server/api/GetterService.js';
import { DI } from '@/di-symbols.js';
import { ApiError } from '../../../error.js';

export const meta = {
	tags: ['notes', 'favorites'],

	requireCredential: true,
	prohibitMoved: true,

	kind: 'write:favorites',

	limit: {
		duration: ms('1hour'),
		max: 20,
	},

	errors: {
		noSuchNote: {
			message: 'No such note.',
			code: 'NO_SUCH_NOTE',
			id: '1f600c3d-8eb0-436d-b18f-17e403c0ac42',
		},

		alreadySuperFavorited: {
			message: 'The note has already been marked as a super favorite.',
			code: 'ALREADY_SUPER_FAVORITED',
			id: 'e333ed80-af94-49a9-9f54-accd0783bfc3',
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		noteId: { type: 'string', format: 'misskey:id' },
	},
	required: ['noteId'],
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
		@Inject(DI.noteSuperFavoritesRepository)
		private noteSuperFavoritesRepository: NoteSuperFavoritesRepository,

		private idService: IdService,
		private getterService: GetterService,
	) {
		super(meta, paramDef, async (ps, me) => {
			const note = await this.getterService.getNote(ps.noteId).catch(err => {
				if (err.id === '9725d0ce-ba28-4dde-95a7-2cbb2c15de24') throw new ApiError(meta.errors.noSuchNote);
				throw err;
			});

			const exist = await this.noteSuperFavoritesRepository.exists({
				where: {
					noteId: note.id,
					userId: me.id,
				},
			});

			if (exist) {
				throw new ApiError(meta.errors.alreadySuperFavorited);
			}

			await this.noteSuperFavoritesRepository.insert({
				id: this.idService.gen(),
				noteId: note.id,
				userId: me.id,
			});
		});
	}
}
