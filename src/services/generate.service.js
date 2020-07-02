
export const generateStyles = styles => Object.keys(styles).map(x=>x+":"+styles[x]).join(";");

export const generateColour = (from,to,opacity=1) => {
	const random = Math.floor(Math.random() * (to < from ? to : to - from)) + from;
	return `rgba(${random},${random},${random},${opacity})`;
};
