import * as React from "react"
import * as ReactDOM from "react-dom"
import PlayClueLess from "./components/clueless"
import Network from "./network"

export function initialize(socket_uri: string, element: HTMLElement) {
    Network.socket_uri = socket_uri
	ReactDOM.render(
		<PlayClueLess />,
		element
	)
}