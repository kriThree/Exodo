import { RefObject, useRef } from "react";

class Color {
	minColor = [0, 0, 0];
	maxColor = [0, 0, 0];
	variableName = "";
	procentColor = [0, 0, 0];
	constructor(minColor: string, maxColor: string, variableName: string) {
		for (let g = 0; g < this.minColor.length; g++) {
			this.minColor[g] =
				parseInt(minColor[g * 2], 16) * 16 + parseInt(minColor[g * 2 + 1], 16);

			this.maxColor[g] =
				parseInt(maxColor[g * 2], 16) * 16 + parseInt(maxColor[g * 2 + 1], 16);
			this.procentColor[g] = (this.maxColor[g] - this.minColor[g]) / 100;
		}
		this.variableName = variableName;
	}
	setColor(coefficient: number) {
		return (
			"#" +
			this.minColor
				.map((e, i) => {
					const hexCanalValue = (
						e + Math.round(this.procentColor[i] * coefficient)
					).toString(16);
					return hexCanalValue.length === 1
						? "0" + hexCanalValue
						: hexCanalValue;
				})
				.join("")
		);
	}
}

export function useChangeColors(): [
	Function,
	RefObject<HTMLDivElement> | null
] {
	const screen = useRef() as RefObject<HTMLDivElement> | null;

	const colors = [
		new Color("FFBB6A", "390A04", "--guest-2"),
		new Color("DBC5AA", "210804", "--guest-3"),
		new Color("A20808", "4A5B03", "--func-error"),
		new Color("210804", "83A601", "--additional-3"),
	].map((e) => {
		return e;
	});

	return [
		(value: number) => {
			colors.forEach((e) => {
				screen?.current?.style.setProperty(e.variableName, e.setColor(value));
			});
		},
		screen,
	];
}
