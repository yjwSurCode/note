/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 */

type Mod = string | { [key: string]: any };
type Mods = Mod | Mod[];
type BEM = (el?: Mods, mods?: Mods) => string;

export function createBEM(name: string): BEM {
	const gen = (name: string, mods?: Mods): string => {
		if (!mods) {
			return '';
		}

		if (typeof mods === 'string') {
			return ` ${name}--${mods}`;
		}

		if (Array.isArray(mods)) {
			return mods.reduce<string>(
				(ret, item) => ret + gen(name, item),
				'',
			);
		}

		return Object.keys(mods).reduce(
			(ret, key) => ret + (mods[key] ? gen(name, key) : ''),
			'',
		);
	};

	return function (el?: Mods, mods?: Mods): string {
		if (el && typeof el !== 'string') {
			mods = el;
			el = '';
		}

		el = el ? `${name}__${el}` : name;

		return `${el}${gen(el, mods)}`;
	};
}

/**
 * classnames helper
 * className={classnames(bem({ 'card-mode': cardMode }), className)}    //className  button__card-mode   button__card-mode
 * className={classnames(bem('body'),'test','bodyProps',)}    //  button__body  button__test button__bodyProps
 */
export function classnames(
	...classNames: Array<string | void | Array<string | void>>
): string | undefined {
	const output: string[] = [];
	for (const item of classNames) {
		const cn = Array.isArray(item) ? item : [item];

		for (const c of cn) {
			if (c) {
				output.push(c);
			}
		}
	}

	return output.join(' ');
}
