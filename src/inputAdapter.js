function collectParents(nodeName, map) {
	var stack = [nodeName];

	var node = map[nodeName];
	if (node && node.parent) {
		stack = stack.concat(collectParents(node.parent, map));
	}

	return stack;
}

var map2Array = function(nodeName, map) {
	var nodes = [];

	if (!map[nodeName]) {
		throw new Error(`Node name "${nodeName}" does not exist in the provided node map`);
	}

	return nodes.concat(collectParents(nodeName, map));
}

