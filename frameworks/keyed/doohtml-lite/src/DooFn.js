import Config from './DooConfig.js'


const DooFn = {

	version: 'v0.96.1-beta',
	define: (klass, alias=null) => {
		let name = alias || klass.name.toLowerCase()
		customElements.define('doo-' + name, klass)
	},
	

	getItemValue(item, prop) {
		return item[prop] ?  item[prop] : ''
	},
	
	renderTable (dataSet,target=this.place[0], start=0) {
		let len = dataSet.length
		if (len === 0) {
			target.textContent = ''
			return
		// } else if (target.childNodes.length > len) {
		// 	target.textContent = ''
		}
		this.renderHTML(dataSet, target, start , len - start)
	},

	renderHTML(data, place, start = 0, pgSize = Config.PAGE_SIZE)  {
		let dataLen = data.length
		,stop = start + pgSize
		,newNode
		,curNode
		if (stop > dataLen) { stop = dataLen }

		let len = place.dataSlots.length

		const getNode = (node,arr,x) => {
			let i=arr[x] 
			if (node.childNodes[i]) {
				return getNode(node.childNodes[i], arr, ++x) 
			} 
			return node		
		}
		
		const setNodeValues = (node,i)  => {
			for (let x=0; x<len;x++) {
				curNode = getNode(node,place.dataSlots[x][1],0)
				if (curNode) {
					if (place.dataSlots[x][2] === 'textContent') {
						curNode.textContent = data[i][place.dataSlots[x][0]]
					} else {
						curNode.setAttribute(place.dataSlots[x][2], data[i][place.dataSlots[x][0]])
					}	
				} else {
					console.info('Field:' + place.dataSlots[x][0] + ' does not exist')
				}
			}	
		}

		const dataKey = place.dataKey
		for (let i = start; i<stop; i++) {
			newNode = place.processNode
			setNodeValues(newNode, i)
			place.appendChild(newNode.cloneNode(true))[Config.DATA_KEY_NAME] = this.getItemValue(data[i],dataKey)
		} 			
	},
	append(dataSet, target, start=0)  {
		this.renderHTML(dataSet, target, start , dataSet.length - start)
	}	


	

}

export default DooFn

