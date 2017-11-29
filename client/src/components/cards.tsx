import * as React from "react"

interface Props {
	cards: ClueLess.Card[]
}

interface State {}

export default class Cards extends React.Component<Props,State> {

	renderCard(card: ClueLess.Card) {
		return (
			<div key={card.name} className={ "card " + card.type }>{ card.name }</div>
		)
	}
	
	render() {
		return (
			<div className="cards">
				<h2>Cards</h2>
				{ this.props.cards.map(this.renderCard) }
			</div>
		)
	}

}