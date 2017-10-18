import * as React from "react"
import * as ReactDOM from "react-dom"
import PlayClueLess from "./components/clueless"

export function initialize(server_uri: string, element: HTMLElement) {
	ReactDOM.render(
		<PlayClueLess connection_uri={server_uri} />,
		element
	)
}