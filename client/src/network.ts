class Network {

	public socket_uri: string
	protected socket_connection: WebSocket
	protected operation_listeners: { [index: string]: ClueLess.OperationListener[] } = {}

	connect(): void {
		
		if (this.isConnected()) {
			throw new Error("Network is already connected.")
		}

		this.socket_connection = new WebSocket(this.socket_uri)
		this.socket_connection.addEventListener("message", this.handleMessage.bind(this))
	}

	getWebSocket(): WebSocket {
		return this.socket_connection
	}

	isConnected(): boolean {
		return this.socket_connection instanceof WebSocket && this.socket_connection.readyState === 1
	}

	addOperationListener(operation: ClueLess.Operation, listener: ClueLess.OperationListener): void {
		this.operation_listeners[operation] = this.operation_listeners[operation] || []
		this.operation_listeners[operation].push(listener)
	}

	removeOperationListener(operation: ClueLess.Operation, listener: ClueLess.OperationListener): void {
		this.operation_listeners[operation] = this.operation_listeners[operation] || []
		const listeners = this.operation_listeners[operation]
		const index = listeners.indexOf(listener)
		if (index > -1) {
			listeners.splice(index, 1)
		}
	}

	/**
	 * Removes all listeners or all listeners
	 * for a given operation.
	 * @param {string} operation An optional operation key.
	 */
	removeAllListeners(operation?: string): void {
		if (typeof operation === "string") {
			delete this.operation_listeners[operation]
		} else {
			this.operation_listeners = {}
		}
	}

	/**
	 * Facade for the send method of the WebSocket connection.
	 * @param {any} data
	 */
	send(data: any): void {
		console.log("Sending Message", data)
		this.socket_connection.send(data)
	}

	/**
	 * Called when a new message is received on the connection.
	 * @param  {MessageEvent} e MessageEvent dispatched to the socket.
	 * @return void
	 */
	handleMessage(e: MessageEvent): void {
		const message: ClueLess.Message = JSON.parse(e.data)
		console.log("Received Message", message)
		if (this.operation_listeners && Array.isArray(this.operation_listeners[message.operation])) {
			for (let listener of this.operation_listeners[message.operation]) {
				listener(message)
			}
		}
	}
}

const NetworkInstance = new Network()
export default NetworkInstance