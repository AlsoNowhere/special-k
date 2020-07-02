
import { RADIANS } from "../common/constants";

export const reverseForEach = (scope, callback) => {
	let i = scope.length - 1,
		result;
	while (i >= 0) {
		result = callback(scope[i], i);
		if (result === false) {
			break;
		}
		if (typeof result === "number") {
			i -= result;
		}
		i--;
	}
}

export const getIntercepts = function(lines){
	const intercept = function(a,b){
		const m1 = (a.y2-a.y1)/(a.x2-a.x1),
			c1 = a.y1 - m1 * a.x1,
			m2 = (b.y2-b.y1)/(b.x2-b.x1),
			c2 = b.y1 - m2 * b.x1,
			x = (c2-c1) / (m1-m2),
			y = ((c1*m2) - (c2*m1)) / (m2-m1);
		return {x,y};
	}
	const arr = [
		intercept(lines[0],lines[2]),
		intercept(lines[0],lines[3]),
		intercept(lines[1],lines[2]),
		intercept(lines[1],lines[3])
	];

	arr.forEach((x,i)=>{
		if (i===0) {
			x.x += lines[0].strokeWidth/2+3/2;
			x.y += lines[2].strokeWidth/2+3/2;
		}
		if (i===1) {
			x.x -= lines[0].strokeWidth/2;
			x.y += lines[3].strokeWidth/2+3/2;
		}
		if (i===2) {
			x.x += lines[1].strokeWidth/2+3/2;
			x.y -= lines[2].strokeWidth/2;
		}
		if (i===3) {
			x.x -= lines[1].strokeWidth/2;
			x.y -= lines[3].strokeWidth/2;
		}
	});
	return arr;
}

export const coinFlip = () => (Math.random() < 0.5 ? 1 : -1);

export const getBufferTop = scope => {
	return document.body.clientHeight * 0.1 + scope.header.clientHeight + Math.tan(scope.headerRotation/RADIANS) * document.body.clientWidth
}
