/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
export const processAsync = async (
	processFunc: (resolver: (value: unknown) => void) => Promise<unknown> | unknown,
) =>
	new Promise(resolve => {
		(async () => {
			await processFunc(resolve);
		})() as unknown;
	});

export const sleep = async (ms: number) =>
	new Promise(resolve => {
		const id = setTimeout(() => {
			clearTimeout(id);
			resolve(true);
		}, ms);
	});

export const toUpperCaseHex = (str: string) => {
	if (str.startsWith('0x') || str.startsWith('0X')) {
		return `0x${str.toUpperCase().slice(2)}`;
	}

	return `0x${str.toUpperCase()}`;
};