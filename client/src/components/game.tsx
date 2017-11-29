import * as React from "react"
import * as Commands from "../commands"
import Network from "../network"
import Map from "./map"
import Cards from "./cards"
import Controls from "./controls"

interface Props {
    game: ClueLess.Game,
    player: ClueLess.Player
}
interface State {}

export default class Game extends React.Component<Props, State>
{
    getPlayersInLocation(name: string): ClueLess.Player[] {
        const location = this.props.game.locations.find(l => l.name === name)
        if (!location) {
            return []
        }
        return this.props.game.players.filter(p => location.players.indexOf(p.id) > -1)
    }

    renderPlayersInLocation(name: string): JSX.Element[] {
        return this.getPlayersInLocation(name).map((player) => {
            return (
                <div key={player.id} className={"player " + player.color } />
            )
        })
    }

    render() {

        return (
        	<div className="game">
        		<div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    justifyContent: "flex-start",
                }}>
                    <Map game={this.props.game} />
                    <Controls game={this.props.game} player={this.props.player} />
                </div>
                <hr />
                <h2>Playing As: { this.props.player.character } <span style={{ display: "inline-block" }} className={ "player " + this.props.player.color } /></h2>
                <Cards cards={this.props.player.cards} />
        	</div>
        )
    }
}