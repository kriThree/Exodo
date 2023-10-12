import { RefObject, useRef } from "react";

class templateAmimate {
	minPosition = [0, 0];
	maxPosition = [0, 0];
	ref: RefObject<HTMLDivElement> | null = null;
	framePosition = [0, 0];

	constructor(
		minPosition: [number, number],
		maxPosition: [number, number],
		ref: RefObject<HTMLDivElement> | null
	) {
		this.maxPosition = maxPosition;
		this.minPosition = minPosition;
		this.ref = ref;
		this.framePosition = this.framePosition.map(
			(_, i) => (maxPosition[i] - minPosition[i]) / 100
		);
	}
	setAnimate(coefficient: number) {
		if (this.ref?.current!.style) {

			this.ref.current.style.transform = `translate(${
				this.minPosition[0] + this.framePosition[0] * coefficient
			}%,${this.minPosition[1] + this.framePosition[1] * coefficient}%)`;
		}
	}
}

export const useChangeEmoji = (): [
	Function,
	(RefObject<HTMLDivElement> | null)[]
] => {
	const leftEye = useRef() as RefObject<HTMLDivElement> | null;
	const rightEye = useRef() as RefObject<HTMLDivElement> | null;
	const mouth = useRef() as RefObject<HTMLDivElement> | null;
	const leftEyeClose = useRef() as RefObject<HTMLDivElement> | null;
	const rightEyeClose = useRef() as RefObject<HTMLDivElement> | null;
	const mouthClose = useRef() as RefObject<HTMLDivElement> | null;

	const translates = [
		new templateAmimate([-10, -15], [-10, 30], leftEyeClose),
		new templateAmimate([-10, -15], [-10, 30], rightEyeClose),
		new templateAmimate([-10, 15], [-10, -30], mouthClose),
		new templateAmimate([50, 0], [50, -40], mouth),
	];

	return [
		(value: number) => {
			translates.map((e) => e.setAnimate(value));
		},
		[leftEye, rightEye, mouth, leftEyeClose, rightEyeClose, mouthClose],
	];
};
