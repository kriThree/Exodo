import {
	Dispatch,
	ReactNode,
	RefObject,
	useRef,
	useState,
	useEffect,
} from "react";

export const quotes = [
	{
		text: `Did you know that the best  exodo
        is an example of a good app?`,
		author: "Albert Enshtein",
		id: 1234,
	},
	{
		text: `Exodo made my day 12 times more productive`,
		author: "Aristotel",
		id: 1235,
	},
	{
		text: `Exodo helped me out of depression`,
		author: "Van Gogh",
		id: 1236,
	},
	{
		text: `Thanks to exodo I was able to escape from prison`,
		author: "Andy Dufresne",
		id: 1237,
	},
	{
		text: `Did you know that the best  exodo
        is an example of a good app?`,
		author: "Albert Enshtein",
		id: 1238,
	},
];

const widhts = [
	{
		min: 320,
		max: 1100,
		value: 20 / 2,
	},
	{
		min: 1101,
		max: 5000,
		value: 15,
	},
];

const getQuotesWidth = (): number => {
	const actualWidth = document.body.clientWidth;
	return widhts.filter((e) => actualWidth > e.min && actualWidth < e.max)[0]
		.value;
};

export const useQuotes = (
	styles: CSSModuleClasses
): [(RefObject<HTMLDivElement> | null)[], ReactNode] => {
	const quotesContainer = useRef() as RefObject<HTMLDivElement> | null;
	const quotesScroll = useRef() as RefObject<HTMLDivElement> | null;
	const [children, setChildren] = useState<ReactNode>();
	let count = 1;
	let width = getQuotesWidth();

	useEffect(() => {

		if (quotesScroll?.current) {
			setChildren(
				quotes.map(({ text, author, id }) => (
					<div className={styles.quote} key={id}>
						<p className={styles.quotes__text}>{text}</p>
						<p className={styles.quotes__author}>{author}</p>
					</div>
				))
			);
		}
		setInterval(() => {
			if (quotesScroll?.current) {
				quotesScroll.current.style.transform = `translate(-${
					width * count
				}rem)`;
				quotesScroll.current.style.transition = `3000ms`;
				if (count / 2 >= quotes.length) {
					console.log("e", quotesScroll.current.style.transition);
					quotesScroll.current.style.transition = `0ms`;
					count = 0;
					quotesScroll.current.style.transform = `translate(-${
						width * count
					}rem)`;
				}
				++count;
			}
		}, 6000);
	}, []);
	return [[quotesContainer, quotesScroll], children];
};
