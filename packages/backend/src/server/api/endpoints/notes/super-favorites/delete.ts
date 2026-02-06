/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import { Endpoint } from '@/server/api/endpoint-base.js';
import { GetterService } from '@/server/api/GetterService.js';
import { DI } from '@/di-symbols.js';
import type { NoteSuperFavoritesRepository } from '@/models/_.js';
import { ApiError } from '../../../error.js';

export const meta = {
	tags: ['notes', 'favorites'],

	requireCredential: true,

	kind: 'write:favorites',

	errors: {
		noSuchNote: {
			message: 'No such note.',
			code: 'NO_SUCH_NOTE',
			id: 'e51205f9-5a1c-41b3-a7d8-d4be4a9a7b30',
		},

		notSuperFavorited: {
			message: 'You have not marked that note a super favorite.',
			code: 'NOT_SUPER_FAVORITED',
			id: '672946f6-8675-4b81-b47f-507df87784d0',
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

		private getterService: GetterService,
	) {
		super(meta, paramDef, async (ps, me) => {
			const note = await this.getterService.getNote(ps.noteId).catch(err => {
				if (err.id === '9725d0ce-ba28-4dde-95a7-2cbb2c15de24') throw new ApiError(meta.errors.noSuchNote);
				throw err;
			});

			const exist = await this.noteSuperFavoritesRepository.findOneBy({
				noteId: note.id,
				userId: me.id,
			});

			if (exist == null) {
				throw new ApiError(meta.errors.notSuperFavorited);
			}

			await this.noteSuperFavoritesRepository.delete(exist.id);
		});
	}
}
